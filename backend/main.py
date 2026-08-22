from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import traceback
import hashlib

from core import data_loader
from core import predictive_engine
from core import timeline_engine
from core.type_inference import infer_column_types
from core.quality_engine import check_data_quality
from core.recommendation_engine import get_chart_recommendations

_cached_dashboard = None

app = FastAPI(title="VizGen AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "VizGen AI Engine API is running."}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.csv', '.xlsx', '.json', '.tsv')):
        raise HTTPException(status_code=400, detail="Invalid file type. Supported types: csv, xlsx, json, tsv.")
    
    try:
        contents = await file.read()
        
        # Module A: Parse File
        df = data_loader.parse_file(contents, file.filename)
        
        # Module B: Type Inference
        metadata = infer_column_types(df)
        
        # Module C: Quality Engine
        quality_report = check_data_quality(df, metadata)
        
        # Module D: Recommendation Engine
        recommendations = get_chart_recommendations(df, metadata)
        
        # Generate Dataset Fingerprint (Module I)
        file_size_bytes = len(contents)
        sha256_hash = hashlib.sha256(contents).hexdigest()
        memory_usage_bytes = df.memory_usage(deep=True).sum()
        
        type_counts = {}
        for col, meta in metadata.items():
            base_type = meta.get("base_type", "unknown")
            type_counts[base_type] = type_counts.get(base_type, 0) + 1
            
        fingerprint = {
            "filename": file.filename,
            "rows": quality_report["metrics"]["rows"],
            "columns": quality_report["metrics"]["cols"],
            "file_size_bytes": file_size_bytes,
            "memory_usage_bytes": int(memory_usage_bytes),
            "sha256_hash": sha256_hash,
            "type_counts": type_counts,
            "metadata": metadata
        }
        
        global _cached_dashboard
        _cached_dashboard = {
            "status": "success",
            "quality_report": quality_report,
            "recommendations": recommendations,
        }
        
        return {
            "message": "File processed successfully.",
            "quality_report": quality_report,
            "fingerprint": fingerprint,
            "recommendations": recommendations
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/api/predict")
async def get_prediction():
    try:
        # We need a cached dataset to predict on
        df = data_loader.get_latest_dataframe()
        if df is None:
            raise HTTPException(status_code=404, detail="No dataset found. Please upload one first.")
            
        forecast = predictive_engine.generate_forecast(df)
        
        if forecast is None:
            raise HTTPException(status_code=400, detail="Could not generate forecast (not enough numeric data).")
            
        return {"status": "success", "forecast": forecast}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/timeline")
async def get_timeline():
    try:
        df = data_loader.get_latest_dataframe()
        if df is None:
            raise HTTPException(status_code=404, detail="No dataset found. Please upload one first.")
            
        timeline = timeline_engine.get_timeline_analysis(df)
        
        if "error" in timeline:
            raise HTTPException(status_code=400, detail=timeline["error"])
            
        return {"status": "success", "timeline": timeline["timeline"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard")
async def get_dashboard():
    global _cached_dashboard
    if _cached_dashboard is not None:
        return _cached_dashboard
        
    try:
        df = data_loader.get_latest_dataframe()
        if df is None:
            raise HTTPException(status_code=404, detail="No dataset found.")
            
        metadata = infer_column_types(df)
        quality_report = check_data_quality(df, metadata)
        recommendations = get_chart_recommendations(df, metadata)
        
        _cached_dashboard = {
            "status": "success",
            "quality_report": quality_report,
            "recommendations": recommendations,
        }
        return _cached_dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

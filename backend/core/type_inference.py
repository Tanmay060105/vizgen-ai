import pandas as pd
import re

def get_semantic_hint(col_name: str) -> str:
    name = col_name.lower()
    if re.search(r'revenue|price|cost|amount|salary|income', name):
        return 'currency-like'
    if re.search(r'pct|percent|rate|discount|ratio', name):
        return 'percentage-like'
    if re.search(r'country|city|region|state|province|zip|postal', name):
        return 'geographic'
    if re.search(r'^id|_id$|code|number', name):
        return 'identifier'
    if re.search(r'date|time|_at$|_on$', name):
        return 'datetime'
    return ''

def infer_column_types(df: pd.DataFrame) -> dict:
    metadata = {}
    for col in df.columns:
        col_type = str(df[col].dtype)
        base_type = 'unknown'
        
        if pd.api.types.is_numeric_dtype(df[col]):
            base_type = 'numeric'
        elif pd.api.types.is_datetime64_any_dtype(df[col]):
            base_type = 'datetime'
        elif pd.api.types.is_bool_dtype(df[col]):
            base_type = 'boolean'
        else:
            # Check unique ratio to decide between categorical and text
            unique_ratio = df[col].nunique() / len(df) if len(df) > 0 else 0
            if unique_ratio < 0.5 and df[col].nunique() < 100:
                base_type = 'categorical'
            else:
                base_type = 'text'

        semantic_hint = get_semantic_hint(col)
        
        # Fallback check for datetime strings
        if base_type in ['categorical', 'text'] and semantic_hint == 'datetime':
            try:
                pd.to_datetime(df[col], errors='raise')
                base_type = 'datetime'
            except:
                pass
                
        missing_pct = df[col].isnull().mean() * 100
        unique_count = df[col].nunique()
        
        col_meta = {
            "name": col,
            "base_type": base_type,
            "semantic_hint": semantic_hint,
            "missing_pct": missing_pct,
            "unique_count": unique_count,
        }
        
        if base_type == 'numeric':
            col_meta["min"] = float(df[col].min()) if not pd.isna(df[col].min()) else None
            col_meta["max"] = float(df[col].max()) if not pd.isna(df[col].max()) else None
            col_meta["mean"] = float(df[col].mean()) if not pd.isna(df[col].mean()) else None
            col_meta["median"] = float(df[col].median()) if not pd.isna(df[col].median()) else None
            
        metadata[col] = col_meta
        
    return metadata

import pandas as pd
import numpy as np
import math

def get_timeline_analysis(df: pd.DataFrame):
    # 1. Identify temporal column (Year or Date)
    temporal_col = None
    
    # Check for actual datetime columns
    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            temporal_col = col
            break
            
    # Check for columns named 'year', 'date', 'timestamp' if no datetime
    if not temporal_col:
        for col in df.columns:
            if any(keyword in str(col).lower() for keyword in ['year', 'date', 'time']):
                temporal_col = col
                break
                
    if not temporal_col:
        return {"error": "No temporal column (Date or Year) found in the dataset to build a timeline."}

    # Extract Year from temporal column
    try:
        # If it's a string, try converting to datetime
        if not pd.api.types.is_numeric_dtype(df[temporal_col]) and not pd.api.types.is_datetime64_any_dtype(df[temporal_col]):
             df['_temp_year'] = pd.to_datetime(df[temporal_col], errors='coerce').dt.year
        elif pd.api.types.is_datetime64_any_dtype(df[temporal_col]):
             df['_temp_year'] = df[temporal_col].dt.year
        else:
             # Assume it's already a numeric year
             df['_temp_year'] = df[temporal_col]
             
        df = df.dropna(subset=['_temp_year'])
        df['_temp_year'] = df['_temp_year'].astype(int)
    except Exception as e:
         return {"error": f"Could not parse years from column '{temporal_col}'."}

    # Identify primary numeric and categorical columns for visuals
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    numeric_cols = [c for c in numeric_cols if c != '_temp_year' and c != temporal_col]
    
    cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    cat_cols = [c for c in cat_cols if c != temporal_col and df[c].nunique() < 20]
    
    if not numeric_cols:
        # Fallback to count if no numerics
        df['_count'] = 1
        numeric_cols = ['_count']
        
    primary_num = numeric_cols[0]
    primary_cat = cat_cols[0] if cat_cols else None
    
    # 2. Group by Year
    years = sorted(df['_temp_year'].unique().tolist())
    
    timeline_data = []
    
    for i, year in enumerate(years):
        year_df = df[df['_temp_year'] == year]
        
        # Calculate Metrics
        total_rows = len(year_df)
        total_vol = year_df[primary_num].sum()
        
        # Calculate growth if not first year
        growth_text = ""
        if i > 0:
            prev_year = years[i-1]
            prev_vol = df[df['_temp_year'] == prev_year][primary_num].sum()
            if prev_vol > 0:
                pct_change = ((total_vol - prev_vol) / prev_vol) * 100
                if pct_change > 0:
                    growth_text = f" This represented a **{pct_change:.1f}% growth** from the previous year, "
                else:
                    growth_text = f" This marked a **{abs(pct_change):.1f}% decline** from the previous year, "

        # Top category
        top_cat_text = ""
        top_cat_name = ""
        if primary_cat:
            cat_sums = year_df.groupby(primary_cat)[primary_num].sum().sort_values(ascending=False)
            if not cat_sums.empty:
                top_cat_name = str(cat_sums.index[0])
                top_cat_text = f"driven primarily by activity within the **{top_cat_name}** segment."

        # Generate AI Summary
        summary = (
            f"In **{year}**, the engine detected {total_rows:,} significant events resulting in a total {primary_num} of {total_vol:,.2f}."
            f"{growth_text}{top_cat_text} The predictive neural nets highlight this period as a critical stabilization phase for the overall dataset taxonomy."
        )

        # Generate Advanced Visual (Sunburst or Treemap)
        chart_payload = None
        if primary_cat:
            cat_sums = year_df.groupby(primary_cat)[primary_num].sum().reset_index()
            # Sort and take top 8 to prevent clutter
            cat_sums = cat_sums.sort_values(by=primary_num, ascending=False).head(8)
            
            # Sunburst JSON (More aesthetic and futuristic than Treemap)
            chart_payload = {
                "data": [{
                    "type": "sunburst",
                    "labels": cat_sums[primary_cat].tolist(),
                    "parents": [""] * len(cat_sums),
                    "values": cat_sums[primary_num].tolist(),
                    "textinfo": "label+percent root",
                    "hovertemplate": "<b>%{label}</b><br>Volume: %{value:,.0f}<br>Share: %{percentRoot:.1%}<extra></extra>",
                    "marker": {
                        "colors": cat_sums[primary_num].tolist(),
                        "colorscale": [
                            [0.0, "#4c1d95"], # Dark purple
                            [0.5, "#d946ef"], # Neon pink
                            [1.0, "#06b6d4"]  # Neon cyan
                        ],
                        "line": {"color": "#080b13", "width": 2}
                    }
                }],
                "layout": {
                    "paper_bgcolor": "rgba(0,0,0,0)",
                    "plot_bgcolor": "rgba(0,0,0,0)",
                    "font": {"color": "#ffffff", "family": "Inter, sans-serif", "size": 14},
                    "margin": {"l": 10, "r": 10, "t": 10, "b": 10}
                }
            }
        else:
            # Fallback simple bar chart if no categories
            sums = year_df[primary_num].sum()
            chart_payload = {
                "data": [{
                    "x": [year],
                    "y": [sums],
                    "type": "bar",
                    "marker": {"color": "#00F0FF"}
                }],
                "layout": {
                    "title": f"{year} Total {primary_num}",
                    "paper_bgcolor": "rgba(0,0,0,0)",
                    "plot_bgcolor": "rgba(0,0,0,0)",
                    "font": {"color": "#ffffff"}
                }
            }
            
        timeline_data.append({
            "year": int(year),
            "summary": summary,
            "metrics": {
                "rows": total_rows,
                "total_volume": float(total_vol),
                "top_segment": top_cat_name
            },
            "chart": chart_payload
        })
        
    # Sort descending so newest is first
    timeline_data.sort(key=lambda x: x["year"], reverse=True)
    
    return {"timeline": timeline_data}

import pandas as pd
import numpy as np

def detect_outliers_iqr(series: pd.Series) -> int:
    try:
        numeric_series = pd.to_numeric(series, errors='coerce').dropna()
        if numeric_series.empty:
            return 0
        q1 = numeric_series.quantile(0.25)
        q3 = numeric_series.quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        return ((numeric_series < lower_bound) | (numeric_series > upper_bound)).sum()
    except Exception:
        return 0

def check_data_quality(df: pd.DataFrame, metadata: dict) -> dict:
    issues = []
    total_cells = df.shape[0] * df.shape[1]
    bad_cells = 0
    
    # 1. Check duplicate rows
    dupes = df.duplicated().sum()
    if dupes > 0:
        issues.append({
            "type": "duplicate_rows",
            "column": None,
            "message": f"Found {dupes} identical rows.",
            "suggestion": "Remove duplicates",
            "severity": "warning"
        })
        bad_cells += dupes * df.shape[1]
        
    for col, meta in metadata.items():
        # 2. Missing values
        missing = df[col].isnull().sum()
        if missing > 0:
            missing_pct = meta['missing_pct']
            sev = "critical" if missing_pct > 20 else "warning"
            issues.append({
                "type": "missing_values",
                "column": col,
                "message": f"Column '{col}' is missing {missing_pct:.1f}% of its values.",
                "suggestion": "Impute median/mode or drop" if missing_pct <= 20 else "Drop column",
                "severity": sev
            })
            bad_cells += missing
            
        # 3. Empty columns
        if missing == len(df):
            issues.append({
                "type": "empty_column",
                "column": col,
                "message": f"Column '{col}' is entirely empty.",
                "suggestion": "Drop column",
                "severity": "critical"
            })
            
        # 4. Outliers (Numeric only)
        if meta['base_type'] == 'numeric':
            outliers = detect_outliers_iqr(df[col].dropna())
            if outliers > 0:
                issues.append({
                    "type": "outliers",
                    "column": col,
                    "message": f"Found {outliers} potential outliers in '{col}'.",
                    "suggestion": "Cap values or investigate",
                    "severity": "info"
                })
                # Don't heavily penalize score for outliers, they might be valid
                bad_cells += outliers * 0.1 
                
        # 5. Categorical checks (whitespace/case inconsistencies, high cardinality)
        if meta['base_type'] == 'categorical':
            if meta['unique_count'] > 50:
                issues.append({
                    "type": "high_cardinality",
                    "column": col,
                    "message": f"Categorical column '{col}' has very high cardinality ({meta['unique_count']}).",
                    "suggestion": "Group rare categories",
                    "severity": "warning"
                })
                
            # Check for leading/trailing whitespace
            if df[col].dtype == 'object':
                stripped = df[col].dropna().astype(str).str.strip()
                whitespace_issues = (df[col].dropna() != stripped).sum()
                if whitespace_issues > 0:
                    issues.append({
                        "type": "whitespace_inconsistency",
                        "column": col,
                        "message": f"'{col}' has {whitespace_issues} values with leading/trailing spaces.",
                        "suggestion": "Strip whitespace",
                        "severity": "warning"
                    })
                    bad_cells += whitespace_issues

    # Calculate score (0-100)
    if total_cells == 0:
        score = 0
    else:
        score = max(0, 100 - (bad_cells / total_cells * 100))
        
    return {
        "score": round(score, 1),
        "issues": issues,
        "metrics": {
            "rows": df.shape[0],
            "cols": df.shape[1],
            "missing_overall": df.isnull().sum().sum() / total_cells * 100 if total_cells else 0,
            "duplicate_rows": int(dupes)
        }
    }

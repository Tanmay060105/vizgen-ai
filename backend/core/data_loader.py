import pandas as pd
import io

import os

MAX_ROWS_THRESHOLD = 500000
CACHE_FILE = os.path.join(os.path.dirname(__file__), '..', 'data_cache.pkl')

_latest_df = None

def get_latest_dataframe():
    global _latest_df
    if _latest_df is not None:
        return _latest_df
    
    # If memory was wiped due to sleep, try loading from disk cache
    if os.path.exists(CACHE_FILE):
        try:
            _latest_df = pd.read_pickle(CACHE_FILE)
            return _latest_df
        except Exception as e:
            print(f"Failed to read disk cache: {e}")
            return None
            
    return None

def set_latest_dataframe(df):
    global _latest_df
    _latest_df = df
    # Persist to disk so it survives cloud environment restarts
    try:
        df.to_pickle(CACHE_FILE)
    except Exception as e:
        print(f"Warning: Failed to write disk cache: {e}")

def parse_file(file_contents: bytes, filename: str) -> pd.DataFrame:
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(file_contents))
        elif filename.endswith('.tsv'):
            df = pd.read_csv(io.BytesIO(file_contents), sep='\t')
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(file_contents))
        elif filename.endswith('.json'):
            df = pd.read_json(io.BytesIO(file_contents))
        else:
            raise ValueError("Unsupported file format.")
    except Exception as e:
        raise ValueError(f"Failed to parse file: {str(e)}")

    if len(df) > MAX_ROWS_THRESHOLD:
        df = df.sample(n=MAX_ROWS_THRESHOLD, random_state=42)
    
    set_latest_dataframe(df)
    return df

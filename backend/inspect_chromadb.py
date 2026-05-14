import inspect
import chromadb
from chromadb.config import Settings

# 1. Print signature of PersistentClient
print('=== chromadb.PersistentClient signature ===')
print(inspect.signature(chromadb.PersistentClient))
print()

# 2. Create Settings with anonymized_telemetry=False and print the field
print('=== chromadb.config.Settings example ===')
settings = Settings(anonymized_telemetry=False)
print(f'Settings object created')
print(f'anonymized_telemetry value: {settings.anonymized_telemetry}')
print()

# 3. Check if PersistentClient accepts 'settings' parameter
print('=== PersistentClient parameters ===')
sig = inspect.signature(chromadb.PersistentClient)
params = list(sig.parameters.keys())
has_settings = 'settings' in params
print(f'Parameters: {params}')
print(f'Accepts "settings" parameter: {has_settings}')

import os
from azure.storage.blob import BlobServiceClient        
from dotenv import load_dotenv

load_dotenv()

connect_str = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = os.getenv("AZURE_CONTAINER_NAME")

blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_client = blob_service_client.get_container_client(container_name)

local_folder = 'uploads'

for filename in os.listdir(local_folder):
    file_path = os.path.join(local_folder, filename)

    if os.path.isfile(file_path):
        lower_filename = filename.lower()
        blob_client = container_client.get_blob_client(lower_filename)

        with open(file_path, 'rb') as data:
            blob_client.upload_blob(data, overwrite=True)
            print(f"Uploaded: {lower_filename}")



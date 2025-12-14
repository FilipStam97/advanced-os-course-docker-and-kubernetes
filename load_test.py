import requests
import json

# Configuration
URL = "http://localhost:30080/data"
HEADERS = {"Content-Type": "application/json"}
PAYLOAD = {"deviceId": "sensor-1", "value": 25.0}
NUM_REQUESTS = 500

def send_post_request(url, headers, json_payload):
    """Sends a single POST request and prints the status code."""
    try:
        response = requests.post(url, headers=headers, json=json_payload)
        print(f"Request successful, Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

def run_load_test():
    """Runs a simple load test by sending multiple POST requests."""
    print(f"Starting load test: sending {NUM_REQUESTS} POST requests to {URL}...")
    for i in range(NUM_REQUESTS):
        send_post_request(URL, HEADERS, PAYLOAD)
    print("Load test finished.")

if __name__ == "__main__":
    run_load_test()

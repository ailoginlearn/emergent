#!/usr/bin/env python3
"""
Focused test for admin contacts endpoints
"""

import requests
import time

BASE_URL = "https://react-portfolio-hub-27.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"
ADMIN_EMAIL = "ailogin.learn@gmail.com"
ADMIN_PASSWORD = "Tanishq@2026@"

session = requests.Session()

def login():
    """Login and get auth cookie"""
    response = session.post(
        f"{API_BASE}/admin/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=10
    )
    return response.status_code == 200

print("Testing Admin Contacts Endpoints")
print("="*80)

# Login
print("\n1. Logging in...")
if login():
    print("✅ Login successful")
else:
    print("❌ Login failed")
    exit(1)

# Wait a bit
time.sleep(2)

# Create a test contact first
print("\n2. Creating test contact...")
contact_response = session.post(
    f"{API_BASE}/contact",
    json={
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "Test message"
    },
    timeout=10
)
print(f"   Status: {contact_response.status_code}")
if contact_response.status_code == 200:
    print("✅ Contact created")
else:
    print(f"❌ Failed: {contact_response.text}")

time.sleep(2)

# Test 1: List contacts
print("\n3. Testing GET /admin/contacts...")
response = session.get(f"{API_BASE}/admin/contacts", timeout=10)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Success - Found {len(data.get('items', []))} contacts")
    contact_id = data.get('items', [{}])[0].get('_id') if data.get('items') else None
    print(f"   First contact ID: {contact_id}")
else:
    print(f"❌ Failed: {response.text}")
    contact_id = None

time.sleep(2)

# Test 2: Search
print("\n4. Testing GET /admin/contacts?q=Test...")
response = session.get(f"{API_BASE}/admin/contacts?q=Test", timeout=10)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Success - Search returned {len(data.get('items', []))} results")
else:
    print(f"❌ Failed: {response.text}")

time.sleep(2)

# Test 3: Filter by status
print("\n5. Testing GET /admin/contacts?status=unread...")
response = session.get(f"{API_BASE}/admin/contacts?status=unread", timeout=10)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Success - Filter returned {len(data.get('items', []))} results")
else:
    print(f"❌ Failed: {response.text}")

time.sleep(2)

# Test 4: Update contact
if contact_id:
    print(f"\n6. Testing PATCH /admin/contacts/{contact_id}...")
    response = session.patch(
        f"{API_BASE}/admin/contacts/{contact_id}",
        json={"status": "read"},
        timeout=10
    )
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success - Status updated to: {data.get('item', {}).get('status')}")
    else:
        print(f"❌ Failed: {response.text}")
    
    time.sleep(2)
    
    # Test 5: Delete contact
    print(f"\n7. Testing DELETE /admin/contacts/{contact_id}...")
    response = session.delete(f"{API_BASE}/admin/contacts/{contact_id}", timeout=10)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Success - Deleted: {data.get('success')}")
    else:
        print(f"❌ Failed: {response.text}")
else:
    print("\n6-7. Skipping PATCH/DELETE tests (no contact ID)")

print("\n" + "="*80)
print("Test complete")

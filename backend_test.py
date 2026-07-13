#!/usr/bin/env python3
"""
Comprehensive backend integration test for Admin Panel Phase 1
Tests all API endpoints with success and failure scenarios
"""

import requests
import json
import time
from typing import Dict, Any

# Base URL from .env NEXT_PUBLIC_BASE_URL
BASE_URL = "https://react-portfolio-hub-27.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Admin credentials from .env
ADMIN_EMAIL = "ailogin.learn@gmail.com"
ADMIN_PASSWORD = "Tanishq@2026@"

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "errors": []
}

def log_test(name: str, passed: bool, details: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")
    
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1
        test_results["errors"].append(f"{name}: {details}")

def print_section(title: str):
    """Print section header"""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")

# Create session to maintain cookies
session = requests.Session()

def test_login_success():
    """Test 1.1: Login with correct credentials"""
    print_section("1. LOGIN / SESSION / LOGOUT")
    
    try:
        response = session.post(
            f"{API_BASE}/admin/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        
        data = response.json()
        
        # Check status code
        if response.status_code != 200:
            log_test("Login with correct credentials", False, 
                    f"Expected 200, got {response.status_code}: {data}")
            return False
        
        # Check response structure
        if not data.get("success"):
            log_test("Login with correct credentials", False, 
                    f"success field not true: {data}")
            return False
        
        # Check user object
        user = data.get("user", {})
        if not user.get("email") or not user.get("role"):
            log_test("Login with correct credentials", False, 
                    f"Missing user fields: {data}")
            return False
        
        if user.get("role") != "admin":
            log_test("Login with correct credentials", False, 
                    f"Expected role 'admin', got '{user.get('role')}'")
            return False
        
        # Check cookie
        if "admin_token" not in session.cookies:
            log_test("Login with correct credentials", False, 
                    "No admin_token cookie set")
            return False
        
        log_test("Login with correct credentials", True, 
                f"User: {user.get('email')}, Role: {user.get('role')}")
        return True
        
    except Exception as e:
        log_test("Login with correct credentials", False, f"Exception: {str(e)}")
        return False

def test_login_idempotent():
    """Test 1.2: Login again should succeed (idempotent)"""
    try:
        response = session.post(
            f"{API_BASE}/admin/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        
        if response.status_code == 200 and response.json().get("success"):
            log_test("Login idempotent (no duplicate user)", True)
            return True
        else:
            log_test("Login idempotent (no duplicate user)", False, 
                    f"Status: {response.status_code}, Response: {response.json()}")
            return False
            
    except Exception as e:
        log_test("Login idempotent (no duplicate user)", False, f"Exception: {str(e)}")
        return False

def test_login_wrong_password():
    """Test 1.3: Login with wrong password"""
    try:
        # Use new session to avoid cookie interference
        temp_session = requests.Session()
        response = temp_session.post(
            f"{API_BASE}/admin/login",
            json={"email": ADMIN_EMAIL, "password": "WrongPassword123!"},
            timeout=10
        )
        
        if response.status_code == 401:
            data = response.json()
            if "error" in data and "Invalid credentials" in data["error"]:
                log_test("Login with wrong password returns 401", True)
                return True
            else:
                log_test("Login with wrong password returns 401", False, 
                        f"Expected 'Invalid credentials' error, got: {data}")
                return False
        else:
            log_test("Login with wrong password returns 401", False, 
                    f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Login with wrong password returns 401", False, f"Exception: {str(e)}")
        return False

def test_login_missing_fields():
    """Test 1.4: Login with missing fields"""
    try:
        temp_session = requests.Session()
        response = temp_session.post(
            f"{API_BASE}/admin/login",
            json={"email": ADMIN_EMAIL},  # Missing password
            timeout=10
        )
        
        if response.status_code == 400:
            log_test("Login with missing fields returns 400", True)
            return True
        else:
            log_test("Login with missing fields returns 400", False, 
                    f"Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Login with missing fields returns 400", False, f"Exception: {str(e)}")
        return False

def test_me_without_cookie():
    """Test 1.5: GET /me without cookie"""
    try:
        temp_session = requests.Session()
        response = temp_session.get(f"{API_BASE}/admin/me", timeout=10)
        
        if response.status_code == 401:
            log_test("GET /me without cookie returns 401", True)
            return True
        else:
            log_test("GET /me without cookie returns 401", False, 
                    f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("GET /me without cookie returns 401", False, f"Exception: {str(e)}")
        return False

def test_me_with_cookie():
    """Test 1.6: GET /me with cookie"""
    try:
        response = session.get(f"{API_BASE}/admin/me", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /me with cookie returns 200", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        user = data.get("user", {})
        
        # Check user fields
        if not user.get("_id") or not user.get("email") or not user.get("role"):
            log_test("GET /me with cookie returns 200", False, 
                    f"Missing user fields: {data}")
            return False
        
        # Check no password leak
        if "passwordHash" in user or "password" in user:
            log_test("GET /me with cookie returns 200", False, 
                    "Password hash leaked in response!")
            return False
        
        log_test("GET /me with cookie returns 200", True, 
                f"User ID: {user.get('_id')}, Email: {user.get('email')}")
        return True
        
    except Exception as e:
        log_test("GET /me with cookie returns 200", False, f"Exception: {str(e)}")
        return False

def test_logout():
    """Test 1.7: POST /logout clears cookie"""
    try:
        response = session.post(f"{API_BASE}/admin/logout", timeout=10)
        
        if response.status_code != 200:
            log_test("POST /logout clears cookie", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        if not data.get("success"):
            log_test("POST /logout clears cookie", False, 
                    f"success not true: {data}")
            return False
        
        # Try to access /me - should fail
        me_response = session.get(f"{API_BASE}/admin/me", timeout=10)
        if me_response.status_code == 401:
            log_test("POST /logout clears cookie", True, 
                    "Cookie cleared, subsequent /me returns 401")
            return True
        else:
            log_test("POST /logout clears cookie", False, 
                    f"After logout, /me returned {me_response.status_code} instead of 401")
            return False
            
    except Exception as e:
        log_test("POST /logout clears cookie", False, f"Exception: {str(e)}")
        return False

def test_dashboard_without_auth():
    """Test 2.1: Dashboard without auth"""
    print_section("2. DASHBOARD")
    
    try:
        temp_session = requests.Session()
        response = temp_session.get(f"{API_BASE}/admin/dashboard", timeout=10)
        
        if response.status_code == 401:
            log_test("GET /dashboard without auth returns 401", True)
            return True
        else:
            log_test("GET /dashboard without auth returns 401", False, 
                    f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("GET /dashboard without auth returns 401", False, f"Exception: {str(e)}")
        return False

def test_dashboard_with_auth():
    """Test 2.2: Dashboard with auth"""
    try:
        # Re-login to get fresh cookie
        session.post(
            f"{API_BASE}/admin/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        
        response = session.get(f"{API_BASE}/admin/dashboard", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /dashboard with auth returns 200", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        # Check stats structure
        stats = data.get("stats", {})
        required_stats = ["totalContacts", "unreadContacts", "totalPages", "publishedPages"]
        
        for stat in required_stats:
            if stat not in stats:
                log_test("GET /dashboard with auth returns 200", False, 
                        f"Missing stat: {stat}")
                return False
        
        # Check recentContacts
        if "recentContacts" not in data:
            log_test("GET /dashboard with auth returns 200", False, 
                    "Missing recentContacts array")
            return False
        
        log_test("GET /dashboard with auth returns 200", True, 
                f"Stats: {stats['totalContacts']} contacts, {stats['totalPages']} pages")
        return True
        
    except Exception as e:
        log_test("GET /dashboard with auth returns 200", False, f"Exception: {str(e)}")
        return False

def test_contact_form_valid():
    """Test 3.1: Contact form with valid data"""
    print_section("3. CONTACT FORM")
    
    try:
        contact_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "subject": "Test Inquiry",
            "message": "This is a test message from the automated test suite."
        }
        
        response = session.post(
            f"{API_BASE}/contact",
            json=contact_data,
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("POST /contact with valid data returns 200", False, 
                    f"Expected 200, got {response.status_code}: {response.text}")
            return False, None
        
        data = response.json()
        
        if not data.get("success"):
            log_test("POST /contact with valid data returns 200", False, 
                    f"success not true: {data}")
            return False, None
        
        contact_id = data.get("id")
        log_test("POST /contact with valid data returns 200", True, 
                f"Contact submitted, ID: {contact_id}")
        return True, contact_data
        
    except Exception as e:
        log_test("POST /contact with valid data returns 200", False, f"Exception: {str(e)}")
        return False, None

def test_contact_form_missing_fields():
    """Test 3.2: Contact form with missing fields"""
    try:
        response = session.post(
            f"{API_BASE}/contact",
            json={"name": "John", "email": "john@example.com"},  # Missing subject and message
            timeout=10
        )
        
        if response.status_code == 400:
            log_test("POST /contact with missing fields returns 400", True)
            return True
        else:
            log_test("POST /contact with missing fields returns 400", False, 
                    f"Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("POST /contact with missing fields returns 400", False, f"Exception: {str(e)}")
        return False

def test_contact_form_invalid_email():
    """Test 3.3: Contact form with invalid email"""
    try:
        response = session.post(
            f"{API_BASE}/contact",
            json={
                "name": "John",
                "email": "invalid-email",
                "subject": "Test",
                "message": "Test message"
            },
            timeout=10
        )
        
        if response.status_code == 400:
            log_test("POST /contact with invalid email returns 400", True)
            return True
        else:
            log_test("POST /contact with invalid email returns 400", False, 
                    f"Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("POST /contact with invalid email returns 400", False, f"Exception: {str(e)}")
        return False

def test_contact_in_dashboard():
    """Test 3.4: Verify contact appears in dashboard"""
    try:
        response = session.get(f"{API_BASE}/admin/dashboard", timeout=10)
        data = response.json()
        
        total_contacts = data.get("stats", {}).get("totalContacts", 0)
        
        if total_contacts > 0:
            log_test("Contact appears in dashboard stats", True, 
                    f"Total contacts: {total_contacts}")
            return True
        else:
            log_test("Contact appears in dashboard stats", False, 
                    "No contacts found in dashboard")
            return False
            
    except Exception as e:
        log_test("Contact appears in dashboard stats", False, f"Exception: {str(e)}")
        return False

def test_admin_contacts_list():
    """Test 4.1: List contacts"""
    print_section("4. ADMIN CONTACTS CRUD")
    
    try:
        response = session.get(f"{API_BASE}/admin/contacts", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /admin/contacts returns paginated list", False, 
                    f"Expected 200, got {response.status_code}")
            return False, None
        
        data = response.json()
        
        # Check structure
        if "total" not in data or "items" not in data:
            log_test("GET /admin/contacts returns paginated list", False, 
                    f"Missing pagination fields: {data}")
            return False, None
        
        items = data.get("items", [])
        contact_id = items[0].get("_id") if items else None
        
        log_test("GET /admin/contacts returns paginated list", True, 
                f"Found {len(items)} contacts, Total: {data.get('total')}")
        return True, contact_id
        
    except Exception as e:
        log_test("GET /admin/contacts returns paginated list", False, f"Exception: {str(e)}")
        return False, None

def test_admin_contacts_search():
    """Test 4.2: Search contacts"""
    try:
        response = session.get(f"{API_BASE}/admin/contacts?q=John", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /admin/contacts with search query", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        log_test("GET /admin/contacts with search query", True, 
                f"Search returned {len(data.get('items', []))} results")
        return True
        
    except Exception as e:
        log_test("GET /admin/contacts with search query", False, f"Exception: {str(e)}")
        return False

def test_admin_contacts_filter_status():
    """Test 4.3: Filter contacts by status"""
    try:
        response = session.get(f"{API_BASE}/admin/contacts?status=unread", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /admin/contacts with status filter", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        log_test("GET /admin/contacts with status filter", True, 
                f"Unread filter returned {len(data.get('items', []))} results")
        return True
        
    except Exception as e:
        log_test("GET /admin/contacts with status filter", False, f"Exception: {str(e)}")
        return False

def test_admin_contacts_update(contact_id: str):
    """Test 4.4: Update contact status"""
    if not contact_id:
        log_test("PATCH /admin/contacts/:id updates status", False, 
                "No contact ID available")
        return False
    
    try:
        # Mark as read
        response = session.patch(
            f"{API_BASE}/admin/contacts/{contact_id}",
            json={"status": "read"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("PATCH /admin/contacts/:id updates status", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        item = data.get("item", {})
        
        if item.get("status") != "read":
            log_test("PATCH /admin/contacts/:id updates status", False, 
                    f"Status not updated: {item}")
            return False
        
        # Mark as unread
        response2 = session.patch(
            f"{API_BASE}/admin/contacts/{contact_id}",
            json={"status": "unread"},
            timeout=10
        )
        
        if response2.status_code == 200:
            log_test("PATCH /admin/contacts/:id updates status", True, 
                    "Successfully toggled read/unread")
            return True
        else:
            log_test("PATCH /admin/contacts/:id updates status", False, 
                    f"Second update failed: {response2.status_code}")
            return False
        
    except Exception as e:
        log_test("PATCH /admin/contacts/:id updates status", False, f"Exception: {str(e)}")
        return False

def test_admin_contacts_delete(contact_id: str):
    """Test 4.5: Delete contact"""
    if not contact_id:
        log_test("DELETE /admin/contacts/:id removes contact", False, 
                "No contact ID available")
        return False
    
    try:
        response = session.delete(
            f"{API_BASE}/admin/contacts/{contact_id}",
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("DELETE /admin/contacts/:id removes contact", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if not data.get("success"):
            log_test("DELETE /admin/contacts/:id removes contact", False, 
                    f"success not true: {data}")
            return False
        
        # Try to delete again - should fail
        response2 = session.delete(
            f"{API_BASE}/admin/contacts/{contact_id}",
            timeout=10
        )
        
        data2 = response2.json()
        if data2.get("success") == False:
            log_test("DELETE /admin/contacts/:id removes contact", True, 
                    "Contact deleted, subsequent delete returns success:false")
            return True
        else:
            log_test("DELETE /admin/contacts/:id removes contact", True, 
                    "Contact deleted successfully")
            return True
        
    except Exception as e:
        log_test("DELETE /admin/contacts/:id removes contact", False, f"Exception: {str(e)}")
        return False

def test_admin_contacts_without_auth():
    """Test 4.6: Contacts endpoints without auth"""
    try:
        temp_session = requests.Session()
        response = temp_session.get(f"{API_BASE}/admin/contacts", timeout=10)
        
        if response.status_code == 401:
            log_test("Admin contacts endpoints require auth", True)
            return True
        else:
            log_test("Admin contacts endpoints require auth", False, 
                    f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Admin contacts endpoints require auth", False, f"Exception: {str(e)}")
        return False

def test_admin_pages_create():
    """Test 5.1: Create page"""
    print_section("5. ADMIN PAGES CRUD")
    
    try:
        page_data = {
            "title": "About Us",
            "content": "<p>This is the about us page content.</p>",
            "excerpt": "Learn more about us",
            "status": "draft"
        }
        
        response = session.post(
            f"{API_BASE}/admin/pages",
            json=page_data,
            timeout=10
        )
        
        if response.status_code != 201:
            log_test("POST /admin/pages creates page", False, 
                    f"Expected 201, got {response.status_code}: {response.text}")
            return False, None
        
        data = response.json()
        item = data.get("item", {})
        
        # Check auto-slug
        if item.get("slug") != "about-us":
            log_test("POST /admin/pages creates page", False, 
                    f"Expected slug 'about-us', got '{item.get('slug')}'")
            return False, None
        
        # Check status
        if item.get("status") != "draft":
            log_test("POST /admin/pages creates page", False, 
                    f"Expected status 'draft', got '{item.get('status')}'")
            return False, None
        
        # Check UUID
        page_id = item.get("_id")
        if not page_id or len(page_id) < 32:
            log_test("POST /admin/pages creates page", False, 
                    f"Invalid UUID: {page_id}")
            return False, None
        
        # Check seoTitle fallback
        if item.get("seoTitle") != "About Us":
            log_test("POST /admin/pages creates page", False, 
                    f"seoTitle should fallback to title, got '{item.get('seoTitle')}'")
            return False, None
        
        log_test("POST /admin/pages creates page", True, 
                f"Page created: ID={page_id}, slug={item.get('slug')}")
        return True, page_id
        
    except Exception as e:
        log_test("POST /admin/pages creates page", False, f"Exception: {str(e)}")
        return False, None

def test_admin_pages_duplicate_slug():
    """Test 5.2: Create page with duplicate title (slug uniqueness)"""
    try:
        # Create another page with same title
        response = session.post(
            f"{API_BASE}/admin/pages",
            json={"title": "About Us"},
            timeout=10
        )
        
        if response.status_code != 201:
            log_test("Duplicate title creates unique slug", False, 
                    f"Expected 201, got {response.status_code}")
            return False, None
        
        data = response.json()
        item = data.get("item", {})
        slug = item.get("slug")
        
        # Should be about-us-2 or similar
        if slug == "about-us":
            log_test("Duplicate title creates unique slug", False, 
                    "Slug should be unique, got 'about-us' again")
            return False, None
        
        if not slug.startswith("about-us-"):
            log_test("Duplicate title creates unique slug", False, 
                    f"Expected slug like 'about-us-2', got '{slug}'")
            return False, None
        
        log_test("Duplicate title creates unique slug", True, 
                f"Unique slug generated: {slug}")
        return True, item.get("_id")
        
    except Exception as e:
        log_test("Duplicate title creates unique slug", False, f"Exception: {str(e)}")
        return False, None

def test_admin_pages_list():
    """Test 5.3: List pages"""
    try:
        response = session.get(f"{API_BASE}/admin/pages", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /admin/pages lists pages", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        items = data.get("items", [])
        
        if len(items) < 2:
            log_test("GET /admin/pages lists pages", False, 
                    f"Expected at least 2 pages, got {len(items)}")
            return False
        
        log_test("GET /admin/pages lists pages", True, 
                f"Found {len(items)} pages")
        return True
        
    except Exception as e:
        log_test("GET /admin/pages lists pages", False, f"Exception: {str(e)}")
        return False

def test_admin_pages_get_single(page_id: str):
    """Test 5.4: Get single page"""
    if not page_id:
        log_test("GET /admin/pages/:id returns page", False, 
                "No page ID available")
        return False
    
    try:
        response = session.get(f"{API_BASE}/admin/pages/{page_id}", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /admin/pages/:id returns page", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        item = data.get("item", {})
        
        if item.get("_id") != page_id:
            log_test("GET /admin/pages/:id returns page", False, 
                    f"Wrong page returned: {item.get('_id')}")
            return False
        
        log_test("GET /admin/pages/:id returns page", True, 
                f"Page: {item.get('title')}")
        return True
        
    except Exception as e:
        log_test("GET /admin/pages/:id returns page", False, f"Exception: {str(e)}")
        return False

def test_admin_pages_get_invalid():
    """Test 5.5: Get page with invalid ID"""
    try:
        response = session.get(f"{API_BASE}/admin/pages/invalid-id-12345", timeout=10)
        
        if response.status_code == 404:
            log_test("GET /admin/pages/:id with bad ID returns 404", True)
            return True
        else:
            log_test("GET /admin/pages/:id with bad ID returns 404", False, 
                    f"Expected 404, got {response.status_code}")
            return False
        
    except Exception as e:
        log_test("GET /admin/pages/:id with bad ID returns 404", False, f"Exception: {str(e)}")
        return False

def test_admin_pages_update(page_id: str):
    """Test 5.6: Update page"""
    if not page_id:
        log_test("PUT /admin/pages/:id updates page", False, 
                "No page ID available")
        return False
    
    try:
        update_data = {
            "status": "published",
            "content": "<p>Updated content</p>"
        }
        
        response = session.put(
            f"{API_BASE}/admin/pages/{page_id}",
            json=update_data,
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("PUT /admin/pages/:id updates page", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        item = data.get("item", {})
        
        if item.get("status") != "published":
            log_test("PUT /admin/pages/:id updates page", False, 
                    f"Status not updated: {item.get('status')}")
            return False
        
        if "updatedAt" not in item:
            log_test("PUT /admin/pages/:id updates page", False, 
                    "updatedAt not set")
            return False
        
        log_test("PUT /admin/pages/:id updates page", True, 
                "Page updated, status=published, updatedAt bumped")
        return True
        
    except Exception as e:
        log_test("PUT /admin/pages/:id updates page", False, f"Exception: {str(e)}")
        return False

def test_admin_pages_update_slug_collision(page_id: str, other_page_id: str):
    """Test 5.7: Update slug to existing slug (should append -N)"""
    if not page_id or not other_page_id:
        log_test("PUT /admin/pages/:id with duplicate slug appends -N", False, 
                "Missing page IDs")
        return False
    
    try:
        # Try to change second page's slug to 'about-us' (first page's slug)
        response = session.put(
            f"{API_BASE}/admin/pages/{other_page_id}",
            json={"slug": "about-us"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("PUT /admin/pages/:id with duplicate slug appends -N", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        item = data.get("item", {})
        slug = item.get("slug")
        
        # Should NOT be 'about-us' exactly
        if slug == "about-us":
            log_test("PUT /admin/pages/:id with duplicate slug appends -N", False, 
                    "Slug collision not handled, got 'about-us'")
            return False
        
        # Should be about-us-N
        if not slug.startswith("about-us-"):
            log_test("PUT /admin/pages/:id with duplicate slug appends -N", False, 
                    f"Expected slug like 'about-us-N', got '{slug}'")
            return False
        
        log_test("PUT /admin/pages/:id with duplicate slug appends -N", True, 
                f"Collision avoided, slug: {slug}")
        return True
        
    except Exception as e:
        log_test("PUT /admin/pages/:id with duplicate slug appends -N", False, 
                f"Exception: {str(e)}")
        return False

def test_admin_pages_delete(page_id: str):
    """Test 5.8: Delete page"""
    if not page_id:
        log_test("DELETE /admin/pages/:id removes page", False, 
                "No page ID available")
        return False
    
    try:
        response = session.delete(f"{API_BASE}/admin/pages/{page_id}", timeout=10)
        
        if response.status_code != 200:
            log_test("DELETE /admin/pages/:id removes page", False, 
                    f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        if not data.get("success"):
            log_test("DELETE /admin/pages/:id removes page", False, 
                    f"success not true: {data}")
            return False
        
        # Try to get deleted page - should 404
        get_response = session.get(f"{API_BASE}/admin/pages/{page_id}", timeout=10)
        if get_response.status_code == 404:
            log_test("DELETE /admin/pages/:id removes page", True, 
                    "Page deleted, subsequent GET returns 404")
            return True
        else:
            log_test("DELETE /admin/pages/:id removes page", False, 
                    f"After delete, GET returned {get_response.status_code}")
            return False
        
    except Exception as e:
        log_test("DELETE /admin/pages/:id removes page", False, f"Exception: {str(e)}")
        return False

def test_admin_pages_without_auth():
    """Test 5.9: Pages endpoints without auth"""
    try:
        temp_session = requests.Session()
        response = temp_session.get(f"{API_BASE}/admin/pages", timeout=10)
        
        if response.status_code == 401:
            log_test("Admin pages endpoints require auth", True)
            return True
        else:
            log_test("Admin pages endpoints require auth", False, 
                    f"Expected 401, got {response.status_code}")
            return False
        
    except Exception as e:
        log_test("Admin pages endpoints require auth", False, f"Exception: {str(e)}")
        return False

def test_public_dynamic_page():
    """Test 6.1: Public dynamic page with published slug"""
    print_section("6. PUBLIC DYNAMIC PAGE")
    
    try:
        # First create and publish a test page
        page_data = {
            "title": "Test Live Page",
            "slug": "test-live",
            "content": "<p>This is a live test page.</p>",
            "status": "published"
        }
        
        create_response = session.post(
            f"{API_BASE}/admin/pages",
            json=page_data,
            timeout=10
        )
        
        if create_response.status_code != 201:
            log_test("GET /[slug] returns published page", False, 
                    f"Failed to create test page: {create_response.status_code}")
            return False, None
        
        page_id = create_response.json().get("item", {}).get("_id")
        
        # Wait a moment for the page to be available
        time.sleep(1)
        
        # Now try to access it publicly
        public_response = requests.get(f"{BASE_URL}/test-live", timeout=10)
        
        if public_response.status_code != 200:
            log_test("GET /[slug] returns published page", False, 
                    f"Expected 200, got {public_response.status_code}")
            return False, page_id
        
        # Check if page title is in HTML
        html = public_response.text
        if "Test Live Page" not in html:
            log_test("GET /[slug] returns published page", False, 
                    "Page title not found in HTML")
            return False, page_id
        
        log_test("GET /[slug] returns published page", True, 
                "Published page accessible at /test-live")
        return True, page_id
        
    except Exception as e:
        log_test("GET /[slug] returns published page", False, f"Exception: {str(e)}")
        return False, None

def test_public_dynamic_page_not_found():
    """Test 6.2: Public dynamic page with non-existent slug"""
    try:
        response = requests.get(f"{BASE_URL}/a-slug-that-does-not-exist-12345", timeout=10)
        
        if response.status_code == 404:
            log_test("GET /[slug] with non-existent slug returns 404", True)
            return True
        else:
            log_test("GET /[slug] with non-existent slug returns 404", False, 
                    f"Expected 404, got {response.status_code}")
            return False
        
    except Exception as e:
        log_test("GET /[slug] with non-existent slug returns 404", False, 
                f"Exception: {str(e)}")
        return False

def test_public_dynamic_page_draft():
    """Test 6.3: Draft pages should not be publicly accessible"""
    try:
        # Create a draft page
        draft_data = {
            "title": "Draft Test Page",
            "slug": "draft-test",
            "content": "<p>This is a draft.</p>",
            "status": "draft"
        }
        
        create_response = session.post(
            f"{API_BASE}/admin/pages",
            json=draft_data,
            timeout=10
        )
        
        if create_response.status_code != 201:
            log_test("Draft pages return 404 publicly", False, 
                    f"Failed to create draft page: {create_response.status_code}")
            return False
        
        draft_id = create_response.json().get("item", {}).get("_id")
        
        # Try to access it publicly
        public_response = requests.get(f"{BASE_URL}/draft-test", timeout=10)
        
        if public_response.status_code == 404:
            log_test("Draft pages return 404 publicly", True, 
                    "Draft page correctly returns 404")
            
            # Clean up
            session.delete(f"{API_BASE}/admin/pages/{draft_id}", timeout=10)
            return True
        else:
            log_test("Draft pages return 404 publicly", False, 
                    f"Draft page accessible! Status: {public_response.status_code}")
            
            # Clean up
            session.delete(f"{API_BASE}/admin/pages/{draft_id}", timeout=10)
            return False
        
    except Exception as e:
        log_test("Draft pages return 404 publicly", False, f"Exception: {str(e)}")
        return False

def cleanup_test_page(page_id: str):
    """Clean up test page"""
    if page_id:
        try:
            session.delete(f"{API_BASE}/admin/pages/{page_id}", timeout=10)
        except:
            pass

def print_summary():
    """Print test summary"""
    print_section("TEST SUMMARY")
    
    total = test_results["passed"] + test_results["failed"]
    pass_rate = (test_results["passed"] / total * 100) if total > 0 else 0
    
    print(f"Total Tests: {total}")
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"Pass Rate: {pass_rate:.1f}%")
    
    if test_results["errors"]:
        print(f"\n{'='*80}")
        print("FAILED TESTS:")
        print(f"{'='*80}\n")
        for error in test_results["errors"]:
            print(f"❌ {error}")
    
    print(f"\n{'='*80}\n")

def main():
    """Run all tests"""
    print(f"\n{'='*80}")
    print(f"  ADMIN PANEL PHASE 1 - BACKEND INTEGRATION TEST")
    print(f"  Base URL: {BASE_URL}")
    print(f"{'='*80}\n")
    
    # 1. Login / Session / Logout
    test_login_success()
    test_login_idempotent()
    test_login_wrong_password()
    test_login_missing_fields()
    test_me_without_cookie()
    test_me_with_cookie()
    test_logout()
    
    # 2. Dashboard
    test_dashboard_without_auth()
    test_dashboard_with_auth()
    
    # 3. Contact Form
    contact_success, contact_data = test_contact_form_valid()
    test_contact_form_missing_fields()
    test_contact_form_invalid_email()
    if contact_success:
        test_contact_in_dashboard()
    
    # 4. Admin Contacts
    contacts_success, contact_id = test_admin_contacts_list()
    test_admin_contacts_search()
    test_admin_contacts_filter_status()
    if contact_id:
        test_admin_contacts_update(contact_id)
        test_admin_contacts_delete(contact_id)
    test_admin_contacts_without_auth()
    
    # 5. Admin Pages
    pages_success, page_id = test_admin_pages_create()
    dup_success, dup_page_id = test_admin_pages_duplicate_slug()
    test_admin_pages_list()
    if page_id:
        test_admin_pages_get_single(page_id)
    test_admin_pages_get_invalid()
    if page_id:
        test_admin_pages_update(page_id)
    if page_id and dup_page_id:
        test_admin_pages_update_slug_collision(page_id, dup_page_id)
    if dup_page_id:
        test_admin_pages_delete(dup_page_id)
    test_admin_pages_without_auth()
    
    # 6. Public Dynamic Page
    public_success, public_page_id = test_public_dynamic_page()
    test_public_dynamic_page_not_found()
    test_public_dynamic_page_draft()
    
    # Cleanup
    if page_id:
        cleanup_test_page(page_id)
    if public_page_id:
        cleanup_test_page(public_page_id)
    
    # Print summary
    print_summary()
    
    # Exit with appropriate code
    if test_results["failed"] > 0:
        exit(1)
    else:
        exit(0)

if __name__ == "__main__":
    main()

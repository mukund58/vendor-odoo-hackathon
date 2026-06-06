# vendor odoo hackathon

# Member 1 — Backend + Database + Business Logic

### Responsibilities

#### Authentication & Roles

* Login
* Signup
* JWT/Auth
* RBAC (Admin, Vendor, Manager, Procurement Officer)

#### Database Design

Create all entities:

```text
User
Vendor
RFQ
Quotation
Approval
PurchaseOrder
Invoice
ActivityLog
```

#### APIs

* Vendor CRUD
* RFQ CRUD
* Quotation Submission
* Approval APIs
* PO Generation
* Invoice Generation

#### Business Workflow

```text
RFQ
 ↓
Quotation
 ↓
Approval
 ↓
PO
 ↓
Invoice
```

This is the heart of the project.

#### PDF & Email

* Generate Invoice PDF
* Send invoice email

---

# Member 2 — Frontend + Dashboard + UX

### Responsibilities

#### UI Design

* Layout
* Sidebar
* Navbar
* Responsive pages

#### Screens

```text
Login
Dashboard
Vendor Management
RFQ Creation
Quotation Submission
Quotation Comparison
Approval Workflow
PO & Invoice
Reports
```

#### Dashboard

* Analytics cards
* Charts
* Statistics

#### Tables

* Search
* Filter
* Sorting
* Pagination

#### Role-based UI

Show different menus for:

* Admin
* Vendor
* Manager
* Procurement Officer

---

# Integration Points



Example:

```json
GET /api/vendors

POST /api/rfqs

POST /api/quotations

POST /api/approvals

POST /api/purchase-orders

POST /api/invoices
```

## Database Relationship Diagram

```mermaid
erDiagram

    USERS {
        int id PK
        string name
        string email
        string password_hash
        string role
        datetime created_at
    }

    VENDORS {
        int id PK
        string company_name
        string gst_number
        string category
        string status
        string contact_person
        string email
        string phone
    }

    RFQS {
        int id PK
        string title
        text description
        datetime deadline
        string status
        int created_by FK
    }

    RFQ_VENDORS {
        int id PK
        int rfq_id FK
        int vendor_id FK
    }

    QUOTATIONS {
        int id PK
        int rfq_id FK
        int vendor_id FK
        decimal total_price
        int delivery_days
        text notes
        string status
        datetime submitted_at
    }

    APPROVALS {
        int id PK
        int quotation_id FK
        int approver_id FK
        string status
        text remarks
        datetime approved_at
    }

    PURCHASE_ORDERS {
        int id PK
        string po_number
        int quotation_id FK
        datetime created_at
        string status
    }

    INVOICES {
        int id PK
        string invoice_number
        int purchase_order_id FK
        decimal subtotal
        decimal tax_amount
        decimal total_amount
        string status
        datetime created_at
    }

    ACTIVITY_LOGS {
        int id PK
        int user_id FK
        string action
        string entity_type
        int entity_id
        datetime created_at
    }

    USERS ||--o{ RFQS : creates
    USERS ||--o{ APPROVALS : approves
    USERS ||--o{ ACTIVITY_LOGS : performs

    RFQS ||--o{ RFQ_VENDORS : assigned_to
    VENDORS ||--o{ RFQ_VENDORS : invited

    RFQS ||--o{ QUOTATIONS : receives
    VENDORS ||--o{ QUOTATIONS : submits

    QUOTATIONS ||--|| APPROVALS : reviewed
    QUOTATIONS ||--|| PURCHASE_ORDERS : generates
    PURCHASE_ORDERS ||--|| INVOICES : creates
```


---

## Workflow Diagram (Also GitHub Compatible)


```mermaid
flowchart LR

A[Procurement Officer]
--> B[Create RFQ]

B --> C[Invite Vendors]

C --> D[Vendor Submit Quotations]

D --> E[Compare Quotations]

E --> F[Manager Approval]

F -->|Approved| G[Generate Purchase Order]

G --> H[Generate Invoice]

H --> I[Print PDF]

H --> J[Send Email]

J --> K[Reports & Analytics]
I --> K
```


---

## Simplified Domain Model

This is the mental model judges will care about:

```text
User
 │
 ├── Creates RFQ
 │
RFQ
 │
 ├── Assigned to Vendors
 │
 └── Receives Quotations
          │
          ▼
      Quotation
          │
          ▼
      Approval
          │
          ▼
   Purchase Order
          │
          ▼
       Invoice
```

### Division

**Member 1**

* Users
* RFQs
* Quotations
* Approvals
* Database

**Member 2**

* Vendors
* Purchase Orders
* Invoices
* Dashboard
* Reports/UI


# Quick Bill - Data Flow Documentation

## Overview
Quick Bill is a React-based invoicing application that uses SessionStorage for data persistence. All components are interconnected through shared data in sessionStorage.

## Application Structure

```
App (Router)
├── Dashboard (Homepage)
├── Settings → [appSettings]
├── Clients → [clients]
├── InvoiceForm → reads [appSettings, clients] → writes [invoices]
├── Invoices → reads [invoices, appSettings]
└── Profile → [userProfile]
```

## SessionStorage Keys & Data Structures

### 1. `appSettings`
**Modified by:** Settings component  
**Used by:** InvoiceForm, Invoices

```javascript
{
  // Company Information (appears on invoices)
  companyName: string,
  companyAddress: string,
  companyICE: string,
  logoDataUrl: string, // Base64 encoded image

  // VAT Configuration
  vatEnabled: boolean,
  vatRate: number, // Decimal (0.2 = 20%)
  vatMode: 'global' | 'per-item',

  // Currency & Numbering
  currency: string, // e.g., 'DH', '$', '€'
  numberingPrefix: string, // e.g., 'INV'
  zeroPadding: number, // e.g., 4 → 0001
  resetNumberYearly: boolean,

  // Business Configuration
  businessType: 'services' | 'commerce',
  monthlyCap: number
}
```

### 2. `clients`
**Modified by:** Clients component  
**Used by:** InvoiceForm (client picker)

```javascript
[
  {
    id: number,
    name: string,
    address: string,
    ice: string // ICE tax identification number
  }
]
```

### 3. `invoices`
**Modified by:** InvoiceForm (create), Invoices (edit/delete)  
**Used by:** Invoices list, Dashboard stats

```javascript
[
  {
    id: number,
    number: string, // Simple number
    displayNumber: string, // Formatted (e.g., INV-2025-0001)
    date: string, // ISO date
    dueDate: string,
    
    // Client Information
    clientName: string,
    clientAddress: string,
    clientICE: string,
    
    // Status
    status: 'paid' | 'pending' | 'overdue',
    
    // Line Items
    items: [
      {
        description: string,
        quantity: number,
        unitPrice: number,
        taxRate: number, // Decimal (only used in per-item mode)
        discount: number // Percentage
      }
    ],
    
    // Totals
    subtotal: number,
    vat: number,
    total: number,
    
    notes: string
  }
]
```

### 4. `userProfile`
**Modified by:** Profile component  
**Independent from other components**

```javascript
{
  name: string,
  email: string,
  phone: string,
  avatar: string, // URL or Base64
}
```

## Component Data Flow

### Creating an Invoice (InvoiceForm)

1. **Load Configuration**
   - Reads `appSettings` for VAT mode, currency, numbering
   - Reads `clients` for client picker dropdown
   - Reads `invoices` to calculate next invoice number

2. **User Input**
   - Selects client (auto-fills name, address, ICE)
   - Adds line items with quantities, prices
   - VAT calculated automatically based on `vatMode`:
     - **Global Mode**: Single rate applied to subtotal
     - **Per-Item Mode**: Individual rate per line item
   - Global discount applied to final subtotal

3. **Preview**
   - Shows formatted invoice with company info from `appSettings`
   - Displays invoice number using `numberingPrefix` and `zeroPadding`
   - Includes logo if set in `appSettings.logoDataUrl`

4. **Save**
   - Creates invoice object with all calculations
   - Appends to `invoices` array in sessionStorage
   - Redirects to Invoices list

### Managing Invoices (Invoices Component)

1. **Load Data**
   - Reads `invoices` from sessionStorage
   - Reads `appSettings` for company info in preview modals

2. **Filtering & Search**
   - Filter by status (paid, pending, overdue, all)
   - Search by client name or invoice number
   - Sort by date, total, or status

3. **Actions**
   - **View**: Display full invoice details in modal
   - **Edit**: Modify invoice data, recalculate totals
   - **Duplicate**: Create copy with new invoice number
   - **Delete**: Remove from sessionStorage
   - **Export CSV**: Download filtered invoices

4. **Statistics**
   - Total amount, paid, pending, overdue
   - Calculated using `useMemo` for performance

### Configuration (Settings)

1. **Load Settings**
   - Reads `appSettings` or uses defaults
   - Tracks original state for change detection

2. **Edit Configuration**
   - All changes are local until "Update Settings" is clicked
   - Button only enabled when changes detected

3. **Save Settings**
   - Writes to `appSettings` in sessionStorage
   - Shows success message for 3 seconds
   - Immediately affects InvoiceForm behavior

### Client Management (Clients)

1. **CRUD Operations**
   - Create: Add new client with auto-increment ID
   - Read: Display all clients in table
   - Update: Edit existing client info
   - Delete: Remove client from list

2. **Auto-Persistence**
   - Every change automatically saves to `clients` in sessionStorage
   - InvoiceForm always has up-to-date client list

## VAT Calculation Logic

### Global VAT Mode
```
Item Total = Quantity × Unit Price
Items Sum = Σ(Item Totals)
Discount Amount = Items Sum × (Global Discount % / 100)
Subtotal = Items Sum - Discount Amount
VAT = Subtotal × VAT Rate
Total = Subtotal + VAT
```

### Per-Item VAT Mode
```
For each item:
  Base = Quantity × Unit Price
  After Item Discount = Base × (1 - Item Discount % / 100)
  Item VAT = After Item Discount × Item VAT Rate
  Item Total = After Item Discount + Item VAT

Sum all items:
  Base Sum = Σ(After Item Discount)
  Tax Sum = Σ(Item VAT)

Apply global discount:
  Global Factor = 1 - (Global Discount % / 100)
  Subtotal = Base Sum × Global Factor
  VAT = Tax Sum × Global Factor
  Total = Subtotal + VAT
```

## Best Practices

### Adding New Features
1. Check which sessionStorage keys are needed
2. Load data with fallback defaults
3. Use `useEffect` for auto-save or manual save buttons
4. Update this documentation with new data structures

### Data Validation
- All number inputs use controlled pattern with `.toString()`
- Min/max validation using `Math.max` and `Math.min`
- NaN checks with fallback defaults
- Required fields enforced in forms

### Performance
- Use `useMemo` for expensive calculations (filtering, stats)
- Use `useEffect` only for side effects (save to storage)
- Avoid unnecessary re-renders with proper dependency arrays

## File Structure
```
frontend/
├── src/
│   ├── App.jsx              # Main router and layout
│   ├── main.jsx             # Entry point
│   └── lib/utils.js         # Utility functions
├── pages/
│   ├── Clients.jsx          # Client CRUD
│   ├── Dashboard.jsx        # Dashboard overview
│   ├── InvoiceForm.jsx      # Create invoices
│   ├── Invoices.jsx         # Invoice list
│   ├── Profile.jsx          # User profile
│   ├── Settings.jsx         # App configuration
│   └── ...
├── components/
│   ├── ui/sidebar.jsx       # Sidebar navigation
│   ├── logo.jsx             # Company logo
│   └── logoicon.jsx         # Logo icon
└── DATA_FLOW.md            # This file
```

## Troubleshooting

### VAT not calculating
- Check `appSettings.vatEnabled` is `true`
- Verify `vatRate` is decimal (0.2, not 20)
- Ensure `vatMode` matches expected behavior

### Clients not appearing in InvoiceForm
- Verify clients are saved in sessionStorage
- Check browser console for errors
- Ensure `clients` key exists in sessionStorage

### Invoice numbers not incrementing
- Check existing invoices for `id` field
- Verify `appSettings.zeroPadding` is set
- Look for duplicate IDs causing conflicts

### Settings not persisting
- Ensure "Update Settings" button is clicked
- Check sessionStorage quota not exceeded
- Verify no browser extensions blocking storage

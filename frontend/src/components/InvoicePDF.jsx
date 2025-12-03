import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  sellerInfo: {
    flexDirection: 'column',
  },
  invoiceInfo: {
    textAlign: 'right',
    flexDirection: 'column',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    fontWeight: 'bold',
  },
  tableColDesc: {
    width: '40%',
    padding: 5,
  },
  tableColQty: {
    width: '15%',
    padding: 5,
    textAlign: 'right',
  },
  tableColPrice: {
    width: '20%',
    padding: 5,
    textAlign: 'right',
  },
  tableColTotal: {
    width: '25%',
    padding: 5,
    textAlign: 'right',
  },
  totals: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
  },
});

const InvoicePDF = ({ invoice, settings }) => {
  const currency = settings?.currency || 'DH';
  const vatRate = settings?.vatRate || 0.2;
  const vatEnabled = settings?.vatEnabled !== false;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.sellerInfo}>
            {settings?.logoDataUrl && (
              <Image src={settings.logoDataUrl} style={styles.logo} />
            )}
            <Text style={styles.companyName}>{settings?.companyName || 'Your Company'}</Text>
            <Text>{settings?.companyAddress || 'Your Address'}</Text>
            <Text>ICE: {settings?.companyICE || 'Your ICE'}</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.title}>INVOICE</Text>
            <Text>No: {invoice.number}</Text>
            <Text>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
            {invoice.dueDate && (
              <Text>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
            )}
          </View>
        </View>

        {/* Buyer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text>{invoice.clientName}</Text>
          <Text>{invoice.clientAddress}</Text>
          <Text>ICE: {invoice.clientICE}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColDesc}>
              <Text>Description</Text>
            </View>
            <View style={styles.tableColQty}>
              <Text>Qty</Text>
            </View>
            <View style={styles.tableColPrice}>
              <Text>Price</Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text>Total</Text>
            </View>
          </View>
          {invoice.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableColDesc}>
                <Text>{item.description}</Text>
              </View>
              <View style={styles.tableColQty}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={styles.tableColPrice}>
                <Text>{Number(item.unitPrice).toFixed(2)}</Text>
              </View>
              <View style={styles.tableColTotal}>
                <Text>{(item.quantity * item.unitPrice).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>{Number(invoice.subtotal).toFixed(2)} {currency}</Text>
          </View>
          {vatEnabled && (
            <View style={styles.totalRow}>
              <Text>VAT ({Math.round(vatRate * 100)}%):</Text>
              <Text>{Number(invoice.vat).toFixed(2)} {currency}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>{Number(invoice.total).toFixed(2)} {currency}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;

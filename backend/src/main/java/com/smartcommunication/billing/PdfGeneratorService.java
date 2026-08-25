package com.smartcommunication.billing;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfGeneratorService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("MMM dd, yyyy");
    private static final Color PRIMARY_COLOR = new Color(37, 99, 235);
    private static final Color HEADER_BG = new Color(37, 99, 235);
    private static final Color HEADER_TEXT = Color.WHITE;
    private static final Color ALT_ROW_BG = new Color(243, 244, 246);
    private static final Color BORDER_COLOR = new Color(229, 231, 235);

    private static final Font TITLE_FONT = new Font(Font.HELVETICA, 22, Font.BOLD, HEADER_TEXT);
    private static final Font SUBTITLE_FONT = new Font(Font.HELVETICA, 10, Font.NORMAL, HEADER_TEXT);
    private static final Font HEADING_FONT = new Font(Font.HELVETICA, 14, Font.BOLD, new Color(17, 24, 39));
    private static final Font LABEL_FONT = new Font(Font.HELVETICA, 9, Font.BOLD, new Color(107, 114, 128));
    private static final Font VALUE_FONT = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(17, 24, 39));
    private static final Font VALUE_BOLD_FONT = new Font(Font.HELVETICA, 10, Font.BOLD, new Color(17, 24, 39));
    private static final Font TABLE_HEADER_FONT = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
    private static final Font TABLE_CELL_FONT = new Font(Font.HELVETICA, 9, Font.NORMAL, new Color(55, 65, 81));
    private static final Font TOTAL_LABEL_FONT = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(107, 114, 128));
    private static final Font TOTAL_VALUE_FONT = new Font(Font.HELVETICA, 10, Font.BOLD, new Color(17, 24, 39));
    private static final Font GRAND_TOTAL_FONT = new Font(Font.HELVETICA, 14, Font.BOLD, PRIMARY_COLOR);
    private static final Font NOTES_FONT = new Font(Font.HELVETICA, 9, Font.NORMAL, new Color(107, 114, 128));
    private static final Font FOOTER_FONT = new Font(Font.HELVETICA, 8, Font.ITALIC, new Color(156, 163, 175));
    private static final Font STATUS_FONT = new Font(Font.HELVETICA, 11, Font.BOLD, Color.WHITE);

    public byte[] generateInvoicePdf(Invoice invoice) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 40, 40, 40, 60);
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            writer.setPageEvent(new FooterPageEvent());
            document.open();

            addHeader(document);
            document.add(new Paragraph("\n"));
            addInvoiceInfoSection(document, invoice);
            document.add(new Paragraph("\n"));
            addCustomerSection(document, invoice);
            document.add(new Paragraph("\n"));
            addStatusBadge(document, invoice);
            document.add(new Paragraph("\n"));
            addLineItemsTable(document, invoice);
            document.add(new Paragraph("\n"));
            addTotalsSection(document, invoice);

            if (invoice.getNotes() != null && !invoice.getNotes().isBlank()) {
                document.add(new Paragraph("\n"));
                addNotesSection(document, invoice);
            }

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Invoice PDF: " + e.getMessage(), e);
        }
    }

    private void addHeader(Document document) throws DocumentException {
        PdfPTable headerTable = new PdfPTable(1);
        headerTable.setWidthPercentage(100);

        PdfPCell headerCell = new PdfPCell();
        headerCell.setBackgroundColor(HEADER_BG);
        headerCell.setPadding(20);
        headerCell.setBorder(Rectangle.NO_BORDER);

        Paragraph title = new Paragraph("SmartCommunication CRM", TITLE_FONT);
        title.setAlignment(Element.ALIGN_LEFT);
        headerCell.addElement(title);

        Paragraph sub = new Paragraph("AI-Powered CRM & Omnichannel Communication Platform", SUBTITLE_FONT);
        sub.setAlignment(Element.ALIGN_LEFT);
        headerCell.addElement(sub);

        headerTable.addCell(headerCell);
        document.add(headerTable);
    }

    private void addInvoiceInfoSection(Document document, Invoice invoice) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.5f, 2f, 1.5f, 2f});

        addInfoPair(table, "Invoice Number", invoice.getInvoiceNumber());
        addInfoPair(table, "Issue Date",
                invoice.getIssueDate() != null ? invoice.getIssueDate().format(DATE_FMT) : "N/A");
        addInfoPair(table, "Due Date",
                invoice.getDueDate() != null ? invoice.getDueDate().format(DATE_FMT) : "N/A");
        addInfoPair(table, "Status", invoice.getStatus());

        document.add(table);
    }

    private void addInfoPair(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, LABEL_FONT));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPaddingBottom(8);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, VALUE_BOLD_FONT));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPaddingBottom(8);
        table.addCell(valueCell);
    }

    private void addCustomerSection(Document document, Invoice invoice) throws DocumentException {
        Paragraph heading = new Paragraph("Bill To", HEADING_FONT);
        document.add(heading);
        document.add(new Paragraph("\n"));

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(60);
        table.setHorizontalAlignment(Element.ALIGN_LEFT);
        table.setWidths(new float[]{1f, 2f});

        if (invoice.getCustomer() != null) {
            addInfoPair(table, "Customer",
                    invoice.getCustomer().getFirstName() + " " + invoice.getCustomer().getLastName());
            addInfoPair(table, "Email",
                    invoice.getCustomer().getEmail() != null ? invoice.getCustomer().getEmail() : "N/A");
            if (invoice.getCustomer().getCompany() != null) {
                addInfoPair(table, "Company", invoice.getCustomer().getCompany().getName());
            }
        } else {
            addInfoPair(table, "Customer", "N/A");
        }

        document.add(table);
    }

    private void addStatusBadge(Document document, Invoice invoice) throws DocumentException {
        Color badgeColor;
        switch (invoice.getStatus()) {
            case "PAID" -> badgeColor = new Color(34, 197, 94);
            case "SENT" -> badgeColor = new Color(59, 130, 246);
            case "OVERDUE" -> badgeColor = new Color(239, 68, 68);
            case "CANCELLED" -> badgeColor = new Color(107, 114, 128);
            default -> badgeColor = new Color(156, 163, 175);
        }

        PdfPTable badgeTable = new PdfPTable(1);
        badgeTable.setWidthPercentage(25);
        badgeTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

        PdfPCell badgeCell = new PdfPCell(new Phrase("  " + invoice.getStatus() + "  ", STATUS_FONT));
        badgeCell.setBackgroundColor(badgeColor);
        badgeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        badgeCell.setPadding(8);
        badgeCell.setBorder(Rectangle.NO_BORDER);
        badgeTable.addCell(badgeCell);

        document.add(badgeTable);
    }

    private void addLineItemsTable(Document document, Invoice invoice) throws DocumentException {
        Paragraph heading = new Paragraph("Line Items", HEADING_FONT);
        document.add(heading);
        document.add(new Paragraph("\n"));

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.5f, 3f, 1f, 1.5f, 1.5f});

        String[] headers = {"#", "Description", "Qty", "Unit Price", "Total"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, TABLE_HEADER_FONT));
            cell.setBackgroundColor(PRIMARY_COLOR);
            cell.setPadding(10);
            cell.setBorderColor(PRIMARY_COLOR);
            cell.setHorizontalAlignment(header.equals("Description") ? Element.ALIGN_LEFT : Element.ALIGN_RIGHT);
            if (header.equals("#")) cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        List<InvoiceLineItem> items = invoice.getLineItems();
        for (int i = 0; i < items.size(); i++) {
            InvoiceLineItem item = items.get(i);
            Color rowBg = (i % 2 == 0) ? Color.WHITE : ALT_ROW_BG;

            PdfPCell numCell = new PdfPCell(new Phrase(String.valueOf(i + 1), TABLE_CELL_FONT));
            numCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            numCell.setBackgroundColor(rowBg);
            numCell.setPadding(8);
            numCell.setBorderColor(BORDER_COLOR);
            table.addCell(numCell);

            PdfPCell descCell = new PdfPCell(new Phrase(item.getDescription(), TABLE_CELL_FONT));
            descCell.setBackgroundColor(rowBg);
            descCell.setPadding(8);
            descCell.setBorderColor(BORDER_COLOR);
            table.addCell(descCell);

            PdfPCell qtyCell = new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), TABLE_CELL_FONT));
            qtyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            qtyCell.setBackgroundColor(rowBg);
            qtyCell.setPadding(8);
            qtyCell.setBorderColor(BORDER_COLOR);
            table.addCell(qtyCell);

            PdfPCell priceCell = new PdfPCell(new Phrase("$" + formatCurrency(item.getUnitPrice()), TABLE_CELL_FONT));
            priceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            priceCell.setBackgroundColor(rowBg);
            priceCell.setPadding(8);
            priceCell.setBorderColor(BORDER_COLOR);
            table.addCell(priceCell);

            PdfPCell totalCell = new PdfPCell(new Phrase("$" + formatCurrency(item.getTotal()), TABLE_CELL_FONT));
            totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalCell.setBackgroundColor(rowBg);
            totalCell.setPadding(8);
            totalCell.setBorderColor(BORDER_COLOR);
            table.addCell(totalCell);
        }

        if (items.isEmpty()) {
            PdfPCell emptyCell = new PdfPCell(new Phrase("No line items", TABLE_CELL_FONT));
            emptyCell.setColspan(5);
            emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            emptyCell.setPadding(15);
            emptyCell.setBorderColor(BORDER_COLOR);
            table.addCell(emptyCell);
        }

        document.add(table);
    }

    private void addTotalsSection(Document document, Invoice invoice) throws DocumentException {
        PdfPTable totalsTable = new PdfPTable(2);
        totalsTable.setWidthPercentage(45);
        totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalsTable.setWidths(new float[]{2f, 1.5f});

        addTotalRow(totalsTable, "Subtotal", "$" + formatCurrency(invoice.getSubtotal()), TOTAL_LABEL_FONT, TOTAL_VALUE_FONT);
        addTotalRow(totalsTable, "Tax (18%)", "$" + formatCurrency(invoice.getTaxTotal()), TOTAL_LABEL_FONT, TOTAL_VALUE_FONT);

        PdfPCell dividerLeft = new PdfPCell(new Phrase(""));
        dividerLeft.setBorder(Rectangle.BOTTOM);
        dividerLeft.setBorderColor(PRIMARY_COLOR);
        dividerLeft.setBorderWidth(2);
        dividerLeft.setPaddingBottom(8);
        totalsTable.addCell(dividerLeft);

        PdfPCell dividerRight = new PdfPCell(new Phrase(""));
        dividerRight.setBorder(Rectangle.BOTTOM);
        dividerRight.setBorderColor(PRIMARY_COLOR);
        dividerRight.setBorderWidth(2);
        dividerRight.setPaddingBottom(8);
        totalsTable.addCell(dividerRight);

        PdfPCell grandLabelCell = new PdfPCell(new Phrase("Grand Total", GRAND_TOTAL_FONT));
        grandLabelCell.setBorder(Rectangle.NO_BORDER);
        grandLabelCell.setPaddingTop(10);
        grandLabelCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        totalsTable.addCell(grandLabelCell);

        PdfPCell grandValueCell = new PdfPCell(new Phrase("$" + formatCurrency(invoice.getGrandTotal()), GRAND_TOTAL_FONT));
        grandValueCell.setBorder(Rectangle.NO_BORDER);
        grandValueCell.setPaddingTop(10);
        grandValueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalsTable.addCell(grandValueCell);

        document.add(totalsTable);
    }

    private void addTotalRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        labelCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }

    private void addNotesSection(Document document, Invoice invoice) throws DocumentException {
        Paragraph heading = new Paragraph("Notes", HEADING_FONT);
        document.add(heading);
        document.add(new Paragraph("\n"));

        PdfPTable notesTable = new PdfPTable(1);
        notesTable.setWidthPercentage(100);

        PdfPCell notesCell = new PdfPCell(new Phrase(invoice.getNotes(), NOTES_FONT));
        notesCell.setBackgroundColor(ALT_ROW_BG);
        notesCell.setPadding(15);
        notesCell.setBorderColor(BORDER_COLOR);
        notesTable.addCell(notesCell);

        document.add(notesTable);
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0.00";
        return String.format("%,.2f", amount);
    }

    private static class FooterPageEvent extends PdfPageEventHelper {
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footer = new PdfPTable(1);
            footer.setTotalWidth(document.getPageSize().getWidth() - 80);
            try {
                PdfPCell cell = new PdfPCell(new Phrase(
                        "Generated by SmartCommunication CRM | AI-Powered CRM & Omnichannel Communication Platform",
                        new Font(Font.HELVETICA, 8, Font.ITALIC, new Color(156, 163, 175))));
                cell.setBorder(Rectangle.TOP);
                cell.setBorderColor(new Color(229, 231, 235));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPaddingTop(8);
                footer.addCell(cell);
                footer.writeSelectedRows(0, -1, 40, 50, writer.getDirectContent());
            } catch (Exception e) {
                // silently ignore footer errors
            }
        }
    }
}

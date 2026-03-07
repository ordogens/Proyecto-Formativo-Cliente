import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Product } from "../types/invoice";

interface Props {
  products: Product[];
  totalProducts: number;
  totalValor: number;
  issueDate: string;
  dueDate: string;
  invoiceId: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingHorizontal: 200,
    fontSize: 10,
    fontFamily: "Helvetica",
  },

  title: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },

  text: {
    marginBottom: 4,
  },

  paragraph: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: "justify",
    lineHeight: 1,
    fontSize: 8
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  bold: {
    fontWeight: "bold",
  },

  section: {
    marginTop: 10,
  },

  label: {
    fontWeight: "bold",
  },

  smallTitle: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export const InvoicePDF = ({
  products,
  totalProducts,
  totalValor,
  issueDate,
  dueDate,
  invoiceId,
}: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>FACTURA DE COMPRA</Text>

      <Text style={styles.text}>Factura Nº: {invoiceId}</Text>
      <Text style={styles.text}>Fecha de emisión: {issueDate}</Text>
      <Text style={styles.text}>Fecha de vencimiento: {dueDate}</Text>

      <Text style={styles.paragraph}>
        Por medio de la presente se detallan los productos adquiridos conforme
        a las condiciones acordadas entre las partes.
      </Text>

      <View style={styles.section}>
        <View style={[styles.row, styles.bold]}>
          <Text>ID</Text>
          <Text>Nombre</Text>
          <Text>Precio</Text>
        </View>

        {products.map((p) => (
          <View key={p.id} style={styles.row}>
            <Text style={{ width: 40 }}>{p.id}</Text>
            <Text style={{ width: 40 }}>{p.name}</Text>
            <Text style={{ width: 40 }}>${p.price}</Text>
          </View>
        ))}
      </View>

      <View style={{ flex: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 2 }}>
        <Text style={{ fontWeight: "bold" }}>Total productos: {totalProducts}</Text>
        <Text style={{ fontWeight: "bold" }}>Total valor: ${totalValor}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Gracias por su compra. Para cualquier consulta relacionada con esta
          factura, comuníquese con nosotros dentro de los plazos establecidos.
        </Text>

        <Text style={styles.smallTitle}>Información adicional</Text>
        <Text>
          <Text style={styles.label}>Teléfono: </Text>
          +57 323 525 1372
        </Text>

        <Text>
          <Text style={styles.label}>Correo electrónico: </Text>
          soportecys@gmail.com
        </Text>

        <Text>
          <Text style={styles.label}>Dirección: </Text>
          Cr.4 #453 - 72
        </Text>

        <Text>
          <Text style={styles.label}>Ciudad: </Text>
          Armenia, Quindío, Colombia
        </Text>
      </View>
    </Page>
  </Document>
);

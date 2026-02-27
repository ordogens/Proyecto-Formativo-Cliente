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
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
});

export const InvoicePDF = ({
  products,
  totalProducts,
  totalValor,
  issueDate,
  dueDate,
}: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>FACTURA DE COMPRA</Text>

      <Text>Factura Nº: 000123</Text>
      <Text>Fecha de emisión: {issueDate}</Text>
      <Text>Fecha de vencimiento: {dueDate}</Text>

      <View style={{ marginTop: 10 }}>
        <View style={[styles.row, styles.bold]}>
          <Text>ID</Text>
          <Text>Nombre</Text>
          <Text>Precio</Text>
        </View>

        {products.map((p) => (
          <View key={p.id} style={styles.row}>
            <Text>{p.id}</Text>
            <Text>{p.name}</Text>
            <Text>${p.price}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 10 }}>
        <Text>Total productos: {totalProducts}</Text>
        <Text>Total valor: ${totalValor}</Text>
      </View>
    </Page>
  </Document>
);
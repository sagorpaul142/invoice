<template>
  <v-container>
    <div v-if="isLoading">
      <CustomPageLoader pageLoader="isLoading"/>
    </div>
    <v-row>
      <InvoiceAddModal :invoices="invoices"/>
      <v-col cols="12">
        <v-table class="table_padding">
          <thead>
          <tr>
            <th colspan="5" class="text-sm-h4 py-3 font-weight-bold">Order Details</th>
          </tr>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Price</th>
            <th class="text-center">Order Details</th>
          </tr>
          </thead>
          <tbody>
          <template v-if="invoices.length > 0">
            <tr v-for="invoice in invoices" :key="invoice.id">
              <td>{{ invoice.transaction_id }}</td>
              <td>{{ invoice.date }}</td>
              <td>৳ {{ invoice.price }}</td>
              <td class="text-center">
                <v-btn
                    variant="outlined"
                    prepend-icon="mdi-information-outline"
                    class="mr-3"
                    @click="invoiceDetails(invoice)">
                  Details
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="4" class="text-center">
                No invoice found!
              </td>
            </tr>
          </template>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InvoiceAddModal from "@/components/InvoiceAddModal.vue";
import axios from "axios";
import CustomPageLoader from "@/components/CustomPageLoader.vue";

export default {
  name: "HomePage",
  components: {CustomPageLoader, InvoiceAddModal},
  data: () => ({
    invoices: [],
    showModal: false,
    isLoading: true,
  }),
  methods: {
    invoiceDetails(invoice) {
      this.$router.push({
        path: `/${invoice.id}`,
      });
    },
  },
  mounted() {
    axios.get('http://localhost:9000/orders')
        .then(res => {
          this.invoices = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.log(err)
        })
  }
}
</script>

<style>
.v-table > .v-table__wrapper > table {
  border: 1px solid #E0E0E0;
  border-radius: 10px;
}
.table_padding{
  padding: 0!important;
}
</style>
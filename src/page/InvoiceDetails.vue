<template>
  <v-container>
    <v-row>
      <v-col cols="12" id="fullContent">
        <!-- Start Loader section -->
        <div v-if="isLoading">
          <CustomPageLoader pageLoader="isLoading"/>
        </div>
        <!-- End Loader section -->

        <!-- Start back and download section-->
        <div class="justify-space-between flex-wrap header-part">
          <v-btn
              @click="$router.push('/')"
              class="mb-5"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-keyboard-backspace">
            Back
          </v-btn>
          <v-btn
              @click="handleExportWithComponent"
              variant="outlined"
              prepend-icon="mdi-cloud-download"
              color="primary">
            download
          </v-btn>
          <!--          <v-btn @click="printInvoice">Print local range</v-btn>-->
        </div>
        <!-- End back and download section-->

        <!-- Start print button section-->
        <v-btn
            @click="printInvoice"
            prepend-icon="mdi-cloud-print"
            variant="outlined"
            color="primary"
            id="printBtn">
          Print
        </v-btn>

        <PDFExport ref="contentToExport">
          <div class="px-5 mt-5 header-text">
            <h3 class="text-uppercase text-center bg-black pa-2 rounded mt-5">Invoice</h3>
            <address class="pb-3 pt-3">
              <p>Jonathan Neal</p>
              <p>101 E. Chapman Ave<br>Orange, CA 92866</p>
              <p>(800) 555-1234</p>
            </address>
            <div class="d-flex justify-space-between pb-3 flex-wrap">
              <div class="left">
                <h3>Some Company</h3>
              </div>
              <div class="right">
                <p>Invoice : #{{ queryInvoice.invoiceId }}</p>
                <p>Date : {{ queryInvoice.date }}</p>
              </div>
            </div>
          </div>
          <v-table>
            <thead>
            <tr>
              <th>Product Name</th>
              <th class="text-center">Price</th>
            </tr>
            </thead>
            <tbody v-if="queryInvoice">
            <tr>
              <td class="text-capitalize">{{ queryInvoice.productName }}</td>
              <td class="text-center">৳ {{ queryInvoice.price }}</td>
            </tr>
            <tr>
              <td class="text-right">Total</td>
              <td class="text-center font-weight-bold">৳ {{ queryInvoice.price }}</td>
            </tr>
            <tr>
              <td class="text-right">Coupon Discount</td>
              <td class="text-center">৳ {{ queryInvoice.discountPrice }}</td>
            </tr>
            <tr>
              <td class="text-right">Total Paid</td>
              <td class="text-center font-weight-bold">
                ৳ {{ queryInvoice.price - queryInvoice.discountPrice }}
              </td>
            </tr>
            </tbody>
          </v-table>
        </PDFExport>

        <div></div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {useRoute} from "vue-router";
import CustomPageLoader from "@/components/CustomPageLoader.vue";
import axios from "axios";
import {PDFExport} from "@progress/kendo-vue-pdf"

export default {
  components: {
    CustomPageLoader,
    PDFExport
  },
  data() {
    return {
      isLoading: true,
      queryInvoice: {},
      route: useRoute(),
    }
  },
  methods: {
    handleExportWithComponent() {
      this.$refs.contentToExport.save();
    },
    printInvoice() {
      window.print()
    }
  },
  mounted() {
    axios.get(`http://localhost:9000/orders/${this.route.params.id}`)
        .then(res => {
          this.queryInvoice = res.data
          this.isLoading = false
        })
        .catch(err => {
          if (err.code === "ERR_BAD_REQUEST") {
            this.$router.push({
              path: `/`,
            });
            this.isLoading = false
          }
        })
  }
}
</script>

<style>
.v-table > .v-table__wrapper > table {
  border: 1px solid #E0E0E0;
  border-radius: 10px;
}

.v-table {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 40px;
}

tbody tr td, thead tr th {
  border-right: 1px solid #E0E0E0;
}

tbody tr td:last-child, thead tr th:last-child {
  border: none;
}

.header-part {
  display: flex;
}

.right tbody tr td, thead tr th {
  border: none;
}

.print-invoice .title {
  border: 1px solid #E0E0E0;
  border-radius: 10px;
  padding: 10px;
}

@media print {
  @page {
    size: portrait;
    margin: 0;
  }

  .v-toolbar, .header-part {
    display: none !important;
  }

  #printBtn {
    display: none;
  }

  .printPdf, .printPdf * {
    display: block !important;
  }

  .header-text {
    margin: 0 !important;
    padding: 0 !important;
  }

  .header-text h3 {
    margin: 0;
  }
}
</style>
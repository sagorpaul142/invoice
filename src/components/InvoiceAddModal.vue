<template>
  <v-col cols="12">
    <div class="d-flex justify-end mb-4">
      <v-btn
          @click.stop="showModal = true"
          variant="outlined"
          color="primary"
          prepend-icon="mdi-plus-circle-outline"
      >
        Add Invoice
      </v-btn>
    </div>
    <v-row justify="center">
      <v-dialog
          v-model="showModal"
          max-width="600"
          persistent
      >
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Add Invoice</span>
            <v-icon
                class="mx-2 icon mr-4"
                @click="CloseModal"
                icon="mdi-close-circle-outline"
            />
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form @submit.prevent="submitForm" @reset="resetForm">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                      label="User name"
                      color="primary"
                      type="text"
                      variant="underlined"
                      placeholder="Enter your user name"
                      v-model="formData.username"
                      @blur="v$.username.$touch"
                      :error-messages="v$.username.$error ? v$.username.$errors[0].$message : ''"
                  ></v-text-field>

                  <v-text-field
                      label="Product Name"
                      color="primary"
                      variant="underlined"
                      placeholder="Enter Product Name"
                      v-model="formData.productName"
                      @blur="v$.productName.$touch"
                      :error-messages="v$.productName.$error ? v$.productName.$errors[0].$message : ''"
                  ></v-text-field>

                  <v-text-field
                      label="Product Price"
                      type="number"
                      color="primary"
                      variant="underlined"
                      placeholder="Enter product price"
                      v-model="formData.price"
                      @blur="v$.price.$touch"
                      :error-messages="v$.price.$error ? v$.price.$errors[0].$message : ''"
                  >
                  </v-text-field>

                  <v-text-field
                      label="Discount Price"
                      type="number"
                      color="primary"
                      variant="underlined"
                      placeholder="Enter product discount price"
                      v-model="formData.discountPrice"
                      @blur="v$.discountPrice.$touch"
                      :error-messages="v$.discountPrice.$error ? v$.discountPrice.$errors[0].$message : ''"
                  >

                  </v-text-field>

                  <v-text-field
                      label="Date"
                      type="date"
                      color="primary"
                      variant="underlined"

                      :max="getEndDate"
                      v-model="formData.date"
                      @blur="v$.date.$touch"
                      :error-messages="v$.date.$error ? v$.date.$errors[0].$message : ''"
                  >
                  </v-text-field>

                  <v-textarea
                      clearable
                      label="Address"
                      color="primary"
                      variant="underlined"
                      placeholder="Please write address"
                      v-model="formData.address"
                      @blur="v$.address.$touch"
                      :error-messages="v$.address.$error ? v$.address.$errors[0].$message : ''"
                  >
                  </v-textarea>
                  <div class="w-100 text-center">
                    <v-btn
                        @click="submitForm"
                        class="ma-2 text-white"
                        color="primary"
                        elevation="2"
                        outlined
                    >
                      <v-progress-circular
                          v-if="isLoading"
                          style="color: white" :size="20"
                          class="mr-2"
                          indeterminate>
                      </v-progress-circular>
                      Submit
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-col>
</template>

<script>
import {reactive} from "vue";
import {useVuelidate} from '@vuelidate/core'
import {required, minLength, maxLength, helpers} from '@vuelidate/validators'
import {uuid} from "vue-uuid"
import {toast} from 'vue3-toastify';
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "InvoiceAddModal",
  props: {
    invoices: Array
  },
  setup() {
    const formData = reactive({
      id: uuid.v4(),
      invoiceId: Math.floor(1000 + Math.random() * 9000),
      username: "",
      productName: "",
      price: "",
      discountPrice: "",
      address: "",
      date: "",
    });

    const isLetter = (value) => {
      if (value !== undefined) return /^[a-z\s]+$/i.test(value);
    }
    const rules = {
      username: {
        required: helpers.withMessage("User name is required", required),
        isLetter: helpers.withMessage("User name must be only letters", isLetter),
        minLength: helpers.withMessage(
            "User name should be at least 3 characters long",
            minLength(3)
        ),
        maxLength: helpers.withMessage(
            "User name maximum length allowed is 15 characters",
            maxLength(15)
        ),
      },
      productName: {
        required: helpers.withMessage("Product name is required", required),
        minLength: helpers.withMessage(
            "Product name should be at least 3 characters long",
            minLength(3)
        ),
        maxLength: helpers.withMessage(
            "Product name maximum length allowed is 50 characters",
            maxLength(50)
        ),
      },
      price: {
        required: helpers.withMessage("Price is required", required),
        minLength: helpers.withMessage(
            "Price should be at least 2 digit long",
            minLength(2)
        ),
        maxLength: helpers.withMessage(
            "Price maximum length allowed is 8 digits",
            maxLength(8)
        ),
      },
      discountPrice: {
        minLength: helpers.withMessage(
            "Discount price should be at least 2 digit long",
            minLength(2)
        ),
        maxLength: helpers.withMessage(
            "Discount price maximum length allowed is 4 digits",
            maxLength(4)
        ),
      },
      date: {
        required: helpers.withMessage("Date is required", required),
      },
      address: {
        required: helpers.withMessage("Address is required", required),
        minLength: helpers.withMessage(
            "Address should be at least 3 characters long",
            minLength(3)
        ),
        maxLength: helpers.withMessage(
            "Address maximum length allowed is 100 characters",
            maxLength(100)
        ),
      }
    }
    const v$ = useVuelidate(rules, formData);
    return {v$, formData}
  },
  data() {
    return {
      showModal: false,
      isLoading: false,
      nowDate: new Date().toISOString().slice(0, 10),
      getEndDate: new Date().toISOString().slice(0, 10)
    };
  },
  methods: {
    resetForm() {
      this.formData.username = undefined;
      this.formData.productName = undefined;
      this.formData.price = undefined;
      this.formData.discountPrice = undefined;
      this.formData.date = undefined;
      this.formData.address = undefined;
      this.v$.$reset();
    },
    submitForm() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let user = {
          transaction_id: uuid.v4(),
          invoiceId: this.formData.invoiceId,
          username: this.formData.username,
          productName: this.formData.productName,
          price: parseFloat(this.formData.price),
          discountPrice: this.formData.discountPrice === "" ? 0 : parseFloat(this.formData.discountPrice),
          date: this.formData.date,
          address: this.formData.address,
        };
        this.isLoading = true;
        axios.post('http://localhost:9000/orders', user)
            .then(response => {
              console.log(response)
              this.isLoading = false
              this.showModal = false
              // eslint-disable-next-line vue/no-mutating-props
              this.invoices.push(response.data)
              this.resetForm()
              toast.success("Invoice added Successfully", {
                position: toast.POSITION.TOP_RIGHT,
                closeButton: true
              });
            }).catch(err => {
          console.log(err)
        })

      }
    },
    CloseModal() {
      Swal.fire({
        title: "Do you want to close the modal?",
        showCancelButton: true,
        confirmButtonText: "Ok",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.showModal = false;
          this.resetForm()
        }
      });
    },
  },
}
</script>

<style>
</style>
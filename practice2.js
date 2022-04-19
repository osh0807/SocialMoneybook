var app = new Vue({
  el: "#app",
  data: {
    errorMessage: "",
    successMessage: "",
    usages: "",
    listnum: "",
    showAddModal: false,
    showEditModal: false,
    showDeleteModal: false,
    balance: 0,
    response: [],
    newRecord: {
      date: "",
      type: "",
      title: "",
      amount: "",
      category: "",
      entrynum: ""
    },
    clicked: {}
  },

  mounted: function() {
    console.log("Mounted");
    this.getAllRecords();
    this.bringBalance();
  },




  
  methods: {
    getAllRecords: function() {
      axios
        .get("ajaxfile.php?action=read", {
          params: {
            listnum: this.listnum
          }
        })
        .then(function(response) {
          if (response.data.error) {
            app.errorMessage = response.data.message;
          } else {
            app.usages = response.data.history;
          }
        });
    },

    saveRecord: function() {
      var formData = app.toFormData(app.newRecord);
      axios
        .post("ajaxfile.php?action=create", formData, {
          params: {
            listnum: this.listnum
          }
        })
        .then(function(response) {
          app.newRecord = {
            date: "",
            type: "",
            title: "",
            amount: "",
            category: "",
            entrynum: ""
          };

          if (response.data.error) {
            app.errorMessage = response.data.message;
          } else {
            app.successMessage = response.data.message;
            app.getAllRecords();
            app.bringBalance();
          }
        });
    },

    updateRecord: function() {
      var formData = app.toFormData(app.clicked);
      axios
        .post("ajaxfile.php?action=update", formData, {
          params: {
            listnum: this.listnum
          }
        })
        .then(function(response) {
          app.clicked = {};
          if (response.data.error) {
            app.errorMessage = response.data.message;
          } else {
            app.successMessage = response.data.message;
            app.getAllRecords();
          }
        });
    },

    deleteRecord: function() {
      var formData = app.toFormData(app.clicked);
      axios
        .post("ajaxfile.php?action=delete", formData, {
          params: {
            listnum: this.listnum
          }
        })
        .then(function(response) {
          app.clicked = {};
          if (response.data.error) {
            app.errorMessage = response.data.message;
          } else {
            app.successMessage = response.data.message;
            app.getAllRecords();
            app.bringBalance();
          }
        });
    },

    selectRecord(usage) {
      this.clicked = usage;
    },

    toFormData: function(obj) {
      var form_data = new FormData();
      for (var key in obj) {
        form_data.append(key, obj[key]);
      }
      return form_data;
    },

    updateBalance1: function() {
      var formData = app.toFormData(app.newRecord);
      axios
        .post("ajaxfile.php?action=balancePlus", formData, {
          params: {
            listnum: this.listnum
          }
        })
        .then(function(response) {
          if (response.data.error) {
            app.errorMessage = response.data.message;
          } else {
            app.successMessage = response.data.message;
          }
        });
    },

    // updateBalance2a: function() {
    //   var formData = app.toFormData(app.clickedForBalance);
    //   axios
    //     .post("ajaxfile.php?action=balanceMinus", formData)
    //     .then(function(response) {
    //       if (response.data.error) {
    //         app.errorMessage = response.data.message;
    //       } else {
    //         app.successMessage = response.data.message;
    //       }
    //     });
    // },

    // updateBalance2b: function() {
    //   var formData = app.toFormData(app.clicked);
    //   axios
    //     .post("ajaxfile.php?action=balancePlus", formData)
    //     .then(function(response) {
    //       if (response.data.error) {
    //         app.errorMessage = response.data.message;
    //       } else {
    //         app.successMessage = response.data.message;
    //       }
    //     });
    // },

    updateBalance3: function() {
      var formData = app.toFormData(app.clicked);
      axios
        .post("ajaxfile.php?action=balanceMinus", formData, {
          params: {
            listnum: this.listnum
          }
        })
        .then(function(response) {
          if (response.data.error) {
            app.errorMessage = response.data.message;
          } else {
            app.successMessage = response.data.message;
          }
        });
    },

    bringBalance: function() {
      axios
        .get("ajaxfile.php?action=bringBalance", {
          params: {
            listnum: this.listnum
          }
        })
        .then(function(response) {
          if (response.data.error) {
            app.errorMessage = response.data.message;
          } else {
            app.balance = response.data.balance;
          }
        });
    }
  }
});

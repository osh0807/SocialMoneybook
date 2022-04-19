var app = new Vue({
    el: '#root',
    data: {
        name: '',
        currencyfrom: [
            { name: "$", desc: "US Dollar" },
            { name: "€", desc: "Euro" },
            { name: "₩", desc: "Korean Won" },
            { name: "£", desc: "British pound" },
            { name: "¥", desc: "Renminbi (Chinese) yuan" },
            { name: "₿", desc: "Bitcoin" }
        ],
        convertFrom: "",
        convertTo: "",
        amount: "",
        monthselected: "",

        showingAddModal: false,
        showingloginModal: false,
        showinglogoutModal: false,
        addingBookmodal: false,
        editingBookmodal: false,
        viewingBookmodal: false,
        viewBook: false,
        loginStatus: true,
        bookTable: true,
        listTable: false,
        modalForlistmonth: false,
        editingListmodal: false,
        viewingListmodal: false,
        errorMessage: "",
        successMessage: "",
        books: [],
        listings: [],
        addBook: { title: "" },
        editBook: { title: " " },
        newUser: { username: "", email: "", password: "" },
        loginUser: { username: "", password: "" },
        addMonth_list: { year: "", month: "" },
        clickedBook: {},
        clickedList: {},
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
        clicked: {},
        order: "date",
        viewOption1: "",
        viewOption2: ""
    },

    mounted: function () {
        console.log('Mounted')


    },
    methods: {
        selectedMonth() {
        },
        getAllBooks: function () {
            axios.get("api.php?action=read")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.books = response.data.books
                    }
                })
        },

        getAllLists: function () {
            axios.get("api.php?action=readList")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                        app.listings = response.data.listings
                    }
                })
        },



        saveUser: function () {
            var formData = app.toFormData(app.newUser)
            axios.post("api.php?action=create", formData)
                .then(function (response) {
                    app.newUser = { username: "", email: "", password: "" }
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                    }
                })
        },

        login: function () {
            var formData = app.toFormData(app.loginUser)
            axios.post("api.php?action=log_in", formData)
                .then(function (response) {
                    app.loginUser = { username: "", password: "" }
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                        app.loginStatus = false
                        app.getAllBooks()
                        console.log('loggedin')
                    }
                })
        },
        logout: function () {
            var formData = app.toFormData(app.logout)
            axios.post("logout.php?action=logout", formData)
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                        app.viewBook = false
                        app.loginStatus = true
                        app.bookTable = true
                        app.listTable = false
                        app.listings = []
                        app.clickedBook = {}
                        app.clickedList = {}
                        app.usages = ""
                        app.listnum = ""
                        app.clicked = {}
                        console.log('loggedout')
                    }
                })
        },

        selectBook(book) {
            app.clickedBook = book
        },

        selectList(listing) {
            app.clickedList = listing
        },

        bookAdd() {
            var formData = app.toFormData(app.addBook)
            axios.post("api.php?action=addBook", formData)
                .then(function (response) {
                    app.addBook = { title: "" }
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                        console.log('book added')
                    }
                })

            app.getAllBooks()

        },

        bookEdit() {
            var formData = app.toFormData(app.clickedBook)
            axios.post("api.php?action=editBook", formData)
                .then(function (response) {
                    app.clickedBook = {}
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                        app.getAllBooks()
                    }
                })
        },

        bookView() {
            var formData = app.toFormData(app.clickedBook)
            axios.post("api.php?action=view_book", formData)
                .then(function (response) {
                    // app.clickedBook = {}
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                        console.log('sh')
                    } else {
                        app.successMessage = response.data.message
                        app.bookTable = false;
                        app.listings = response.data.listings
                       
                    }
                })
        },

        listMonthAdd() {
            var formData = app.toFormData(app.addMonth_list)
            axios.post("api.php?action=addMonth", formData)
                .then(function (response) {
                    app.addMonth_list = { year: "", month: "" }
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                        app.getAllLists()
                        console.log('month added')
                    }
                })


        },

        listEdit() {
            var formData = app.toFormData(app.clickedList)
            axios.post("api.php?action=editList", formData)
                .then(function (response) {
                    app.clickedList = {}
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                        app.getAllLists()
                    }
                })
        },



        getAllRecords: function () {
            var formData = app.toFormData(app.clickedList)
            axios.post("ajaxfile.php?action=read", formData, {
                params: {
                    listnum: app.clickedList.listnum,
                    order: app.order,
                    viewOption1: app.viewOption1
                }
            })
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message
                        app.usages = response.data.history
                        app.listTable = true
                        viewOption2 = "";
                        viewOption1 = "";
                    }
                });
        },


        getAllRecords2: function () {
            var formData = app.toFormData(app.clickedList)
            axios
                .post("ajaxfile.php?action=categorize", formData, {
                    params: {
                        listnum: app.clickedList.listnum,
                        order: app.order,
                        // viewOption1 = this.viewOption1,
                        viewOption2: app.viewOption2
                    }
                })
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.usages = response.data.history;
                        viewOption2 = "";
                        viewOption1 = "";
                    }
                });
        },

        saveRecord: function () {
            var formData = app.toFormData(app.newRecord);
            axios
                .post("ajaxfile.php?action=create", formData, {
                    params: {
                        listnum: app.clickedList.listnum
                    }
                })
                .then(function (response) {
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
                        app.getAllRecords()
                        app.bringBalance()
                    }
                });
        },

        updateRecord: function () {
            var formData = app.toFormData(app.clicked);
            axios
                .post("ajaxfile.php?action=update", formData, {
                    params: {
                        listnum: app.clickedList.listnum
                    }
                })
                .then(function (response) {
                    app.clicked = {};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllRecords()
                    }
                });
        },

        deleteRecord: function () {
            var formData = app.toFormData(app.clicked);
            axios
                .post("ajaxfile.php?action=delete", formData, {
                    params: {
                        listnum: app.clickedList.listnum
                    }
                })
                .then(function (response) {
                    app.clicked = {};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllRecords()
                        app.bringBalance()
                    }
                });
        },

        selectRecord(usage) {
            this.clicked = usage;
        },

        updateBalance1: function () {
            var formData = app.toFormData(app.newRecord);
            axios
                .post("ajaxfile.php?action=balancePlus", formData, {
                    params: {
                        listnum: app.clickedList.listnum
                    }
                })
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                    }
                });
        },


        updateBalance3: function () {
            var formData = app.toFormData(app.clicked);
            axios
                .post("ajaxfile.php?action=balanceMinus", formData, {
                    params: {
                        listnum: app.clickedList.listnum
                    }
                })
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.successMessage = response.data.message
                    }
                });
        },

        bringBalance: function () {
            axios
                .get("ajaxfile.php?action=bringBalance", {
                    params: {
                        listnum: app.clickedList.listnum
                    }
                })
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message
                    } else {
                        app.balance = response.data.balance
                    }
                });
        },

        backtohome() {
            app.viewBook = false
            app.loginStatus = false
            app.bookTable = true
            app.listTable = false
            app.listings = []
            app.clickedBook = {}
            app.clickedList = {}
            app.usages = ""
            app.listnum = ""
            app.clicked = {}
        },

        toFormData: function (obj) {
            var form_data = new FormData();
            for (var key in obj) {
                form_data.append(key, obj[key]);
            }
            return form_data
        }
    },

    computed: {
        finalamount: function () {
            var to = this.convertTo;
            var from = this.convertFrom;
            var final;
            switch (from) {
                case "₿":
                    if (to == "$") {
                        final = this.amount * 9487.01;
                    }
                    if (to == "€") {
                        final = this.amount * 8518.48;
                    }
                    if (to == "₩") {
                        final = this.amount * 11205012.64;
                    }
                    if (to == "¥") {
                        final = this.amount * 65335.14;
                    }
                    if (to == "£") {
                        final = this.amount * 7790.83;
                    }
                    if (to == "₿") {
                        final = this.amount * 1;
                    }
                    break;
            }

            switch (from) {
                case "$":
                    if (to == "$") {
                        final = this.amount * 1;
                    }
                    if (to == "€") {
                        final = this.amount * 0.9;
                    }
                    if (to == "₩") {
                        final = this.amount * 1181.89;
                    }
                    if (to == "¥") {
                        final = this.amount * 6.89;
                    }
                    if (to == "£") {
                        final = this.amount * 0.82;
                    }
                    if (to == "₿") {
                        final = this.amount * 0.00011;
                    }
                    break;

                case "£":
                    if (to == "$") {
                        final = this.amount * 1.22;
                    }
                    if (to == "€") {
                        final = this.amount * 1.09;
                    }
                    if (to == "₩") {
                        final = this.amount * 1435.78;
                    }
                    if (to == "¥") {
                        final = this.amount * 8.37;
                    }
                    if (to == "£") {
                        final = this.amount * 1;
                    }
                    if (to == "₿") {
                        final = this.amount * 0.91;
                    }
                    break;

                case "€":
                    if (to == "$") {
                        final = this.amount * 1.11;
                    }
                    if (to == "€") {
                        final = this.amount * 1;
                    }
                    if (to == "₩") {
                        final = this.amount * 1316.40;
                    }
                    if (to == "¥") {
                        final = this.amount * 7.67;
                    }
                    if (to == "£") {
                        final = this.amount * 0.92;
                    }
                    if (to == "₿") {
                        final = this.amount * 0.00012;
                    }
                    break;

                case "₩":
                    if (to == "$") {
                        final = this.amount * 0.00085;
                    }
                    if (to == "€") {
                        final = this.amount * 0.00076;
                    }
                    if (to == "₩") {
                        final = this.amount * 1;
                    }
                    if (to == "¥") {
                        final = this.amount * 0.0058;
                    }
                    if (to == "£") {
                        final = this.amount * 0.0007;
                    }
                    if (to == "₿") {
                        final = this.amount * 0.000000089;
                    }
                    break;

                case "¥":
                    if (to == "USD") {
                        final = this.amount * 0.15;
                    }
                    if (to == "€") {
                        final = this.amount * 0.13;
                    }
                    if (to == "₩") {
                        final = this.amount * 171.54;
                    }
                    if (to == "¥") {
                        final = this.amount * 1;
                    }
                    if (to == "£") {
                        final = this.amount * 0.12;
                    }
                    if (to == "₿") {
                        final = this.amount * 0.000015;
                    }
                    break;
            }
            return final;
        }
    }
})




Vue.component({})
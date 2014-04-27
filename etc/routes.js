module.exports = {
    // User Accounts
    register: {
        method: "get",
        file: "Register",
        type: "public", // public routes do not require auth, private do
        sync: false,
        devOnly: false,
        params: {
            required: {
                "name": "string",
                "identifier": "string",
                "password": "string"
            },
            optional: {

            }
        }
    },
    authenticate: {
        method: "get",
        file: "Authenticate",
        type: "public",
        sync: false,
        devOnly: false,
        params: {
            required: {
                "identifier": "string",
                "password": "string"
            }
        }
    },

    // Categories
    categories: {
        method: "get",
        file: "Categories",
        type: "private",
        sync: false,
        devOnly: false,
        params: {}
    },

    // Questions
    questions: {
        method: "get",
        file: "QuestionsList",
        type: "private",
        sync: false,
        devOnly: false,
        params: {
            "required": {
                "categoryId": "string"
            }
        }
    },
    question: {
        method: "get",
        file: "Question",
        type: "private",
        sync: false,
        devOnly: false,
        params: {
            "required": {
                "categoryId": "string",
                "id": "string"
            }
        }
    },


    // Dev Mode Routes
    checkPassword: {
        method: "get",
        file: "CheckPassword",
        type: "public",
        sync: false,
        devOnly: true,
        params: {
            required: {
                "identifier": "string",
                "password": "string"
            }
        }
    }
};
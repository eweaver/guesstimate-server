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
                "name": {
                    "type": "string",
                    "minlen": 1,
                    "maxlen": 40
                },
                "identifier": {
                    "type": "string",
                    "minlen": 4,
                    "maxlen": 16
                },
                "password": {
                    "type": "string",
                    "minlen": 8,
                    "maxlen": 40
                }
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
                "identifier": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
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
                "categoryId": {
                    "type": "string",
                    "minlen": 1
                }
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
                "categoryId": {
                    "type": "string",
                    "minlen": 1
                },
                "id": {
                    "type": "string",
                    "minlen": 1
                }
            }
        }
    },

    // Game
    createGame: {
        method: "get",
        file: "CreateGame",
        type: "private",
        sync: false,
        devOnly: false,
        params: {
            "required": {
                "categoryId": {
                    "type": "string",
                    "minlen": 1
                },
                "questionId": {
                    "type": "string",
                    "minlen": 1
                }
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
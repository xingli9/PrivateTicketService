(function() {

    /**
     * Variables
     */
    var username = '1111';
    var user_fullname = 'Xing';
    var lng = -122.08;
    var lat = 37.38;

    /**
     * Initialize
     */
    function init() {
        // Register event listeners
    	onSessionInvalid();
        $('signup-btn').addEventListener('click',signup);

    }
    
    /**
	 * Session
	 */


	function onSessionValid(result) {
		var signupForm = $('signup-form');
		var signupSuccess = $('signup-success');
		showElement(signupSuccess);
		hideElement(signupForm);
	}

	function onSessionInvalid() {
		var signupForm = $('signup-form');
		var signupSuccess = $('signup-success');
		showElement(signupForm);
		hideElement(signupSuccess);
	}


    
    
 // -----------------------------------
	// Login
	// -----------------------------------

    function signup() {
		var username = $('username').value;
		var password = $('password').value;
		var firstname = $('firstname').value;
		var lastname = $('lastname').value;
		password = md5(username + md5(password));

		// The request parameters
		var url = '../signup';
		var req = JSON.stringify({
			username : username,
			password : password,
			firstname : firstname,
			lastname : lastname,
		});

		ajax('POST', url, req,
		// successful callback
		function(res) {
			var result = JSON.parse(res);

			// successfully logged in
			if (result.result === 'SUCCESS') {
				onSessionValid(result);
			}
		},

		// error
		function() {
			showSignupError();
		});
	}


	function showSignupError() {
		$('signup-error').innerHTML = 'Invalid username or password';
	}

	function clearSignupError() {
		$('signup-error').innerHTML = '';
	}

    // -----------------------------------
    // Helper Functions
    // -----------------------------------



    /**
     * A helper function that creates a DOM element <tag options...>
     * 
     * @param tag
     * @param options
     * @returns
     */
    function $(tag, options) {
        if (!options) {
            return document.getElementById(tag);
        }

        var element = document.createElement(tag);

        for (var option in options) {
            if (options.hasOwnProperty(option)) {
                element[option] = options[option];
            }
        }

        return element;
    }

    function hideElement(element) {
        element.style.display = 'none';
    }

    function showElement(element, style) {
        var displayStyle = style ? style : 'block';
        element.style.display = displayStyle;
    }

    /**
     * AJAX helper
     * 
     * @param method -
     *            GET|POST|PUT|DELETE
     * @param url -
     *            API end point
     * @param callback -
     *            This the successful callback
     * @param errorHandler -
     *            This is the failed callback
     */
    function ajax(method, url, data, callback, errorHandler) {
        var xhr = new XMLHttpRequest();

        xhr.open(method, url, true);

        xhr.onload = function() {
        	if (xhr.status === 200) {
				callback(xhr.responseText);
			} else if (xhr.status === 403) {
				onSessionInvalid();
			} else {
				errorHandler();
			}

        };

        xhr.onerror = function() {
            console.error("The request couldn't be completed.");
            errorHandler();
        };

        if (data === null) {
            xhr.send();
        } else {
            xhr.setRequestHeader("Content-Type",
                "application/json;charset=utf-8");
            xhr.send(data);
        }
    }




    init();

})()
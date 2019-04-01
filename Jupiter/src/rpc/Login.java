package rpc;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import db.DBConnection;
import db.DBConnectionFactory;

/**
 * Servlet implementation class Login
 */
@WebServlet("/login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Login() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		DBConnection connection = DBConnectionFactory.getConnection();
		System.out.println("here is the login");
		try {
			HttpSession session = request.getSession(false);			
			JSONObject obj = new JSONObject();
			if (session != null) {
				String userName = session.getAttribute("username").toString();
				JSONObject user = connection.getUser(userName);
				obj.put("result", "SUCCESS").put("username", userName).put("name", String.join(" ", user.get("firstName").toString(), user.get("lastName").toString()));
			} else {
				response.setStatus(403);
				obj.put("result", "Invalid Session");
			}
			RpcHelper.writeJsonObject(response, obj);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			connection.close();
		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		DBConnection connection = DBConnectionFactory.getConnection();
		System.out.println("here is the login post");
		try {
			JSONObject input = RpcHelper.readJsonObject(request);
			String username = input.getString("username");
			String password = input.getString("password");
			
			JSONObject obj = new JSONObject();
			if (connection.verifyLogin(username, password)) {
				HttpSession session = request.getSession();
				session.setAttribute("username", username);
				session.setMaxInactiveInterval(600);
				JSONObject user = connection.getUser(username);
				
				obj.put("result", "SUCCESS").put("username", username).put("name", String.join(" ", user.get("firstName").toString(), user.get("lastName").toString()));
			} else {
				response.setStatus(401);
				System.out.println("login error");
				obj.put("result", "User Doesn't Exist");
			}
			RpcHelper.writeJsonObject(response, obj);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			connection.close();
		}

	}

}

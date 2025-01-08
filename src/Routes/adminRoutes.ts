import express, { Request, Response } from 'express';
import { Router } from 'express';
import {Admin,IAdmin }from '../Schema/AdminSchema'; 
import ApiResponse from '../Helper/apiResponse';

const router = Router();

interface AddAdminRequestBody {
    name: string;
    email: string;
    password: string;
  }

interface LoginAdminRequestBody{
    email: string;
    password: string;
}
  
/**
 * @openapi
 * /createAdmin:
 *   post:
 *     summary: Create a new admin
 *     description: This endpoint allows the creation of a new admin by providing name, email, and password.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin Name
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Successfully created the admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Admin Created
 *                 data:
 *                   $ref: '#/components/schemas/AddAdminRequestBody'
 *       '400':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/createAdmin', async (req: Request<{},{},AddAdminRequestBody>, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const admin = new Admin({ name, email, password });
    await admin.save();

    res.status(200).json(new ApiResponse(200, "Admin Created", admin));
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: true, message: 'Internal Server Error', errorobj: error });
  }
});



/**
 * @openapi
 * /adminLogin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Login an admin
 *     description: Allows an admin to log in by verifying email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nusrat@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: login successfully
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized due to invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: invalid credentials
 *       400:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 errorobj:
 *                   type: object
 */

router.post('/adminLogin', async (req: Request<{},{},LoginAdminRequestBody>, res: Response) => {
    try {
      const { password, email } = req.body;

      if(!email || !password){
        res.status(401).json({error:true,message:"email or password can not be null"});
        return;
      }

      const admin = await Admin.findOne({ email }) as IAdmin | null;


      if(!admin){
        res.status(401).json({error:true,message:"no user found with the mail"});
        return;
      }

      const isPasswordCorrect = await admin.comparePassword(password);

      if(!isPasswordCorrect){
        res.status(401).json({error:true,message:"invalid credentials"});
      }

      const token = admin.createJWT();

  
      res.status(200).json({error:false,message:"login successfully",token:token});
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: true, message: 'Internal Server Error', errorobj: error });
    }
  });



export default router;

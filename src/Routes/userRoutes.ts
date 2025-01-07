import express, { Request, Response } from 'express';
import { Router } from 'express';
import User from '../Schema/UserSchema'; // Adjust the path if necessary
//import { use } from 'express/lib/application';

const router = Router();

interface AddUserRequestBody {
  name: string;
  email: string;
  dob: string;
  isActive: boolean;
}


/**
* @openapi
* /addUser:
*   post:
*     summary: Add a new user
*     description: This endpoint allows the creation of a new user by providing the user's name, email, date of birth, and active status.
*     tags:
*       - Users
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: Nusarat
*               email:
*                 type: string
*                 example: nusarat@example.com
*               dob:
*                 type: string
*                 format: date
*                 example: '1990-01-01'
*               isActive:
*                 type: boolean
*                 example: true
*     responses:
*       '200':
*         description: Successfully added the user
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
*                   example: User Added
*                 data:
*                   type: object
*                   properties:
*                     _id:
*                       type: string
*                       example: '605c72ef1532073d30f4e5d7'
*                     name:
*                       type: string
*                       example: nusarat 
*                     email:
*                       type: string
*                       example: nusarat@example.com
*                     dob:
*                       type: string
*                       format: date
*                       example: '1990-01-01'
*                     isActive:
*                       type: boolean
*                       example: true
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
*                 errorobj:
*                   type: object
*                   example: {}
*/
router.post('/addUser', async (req: Request<{}, {}, AddUserRequestBody>, res: Response) => {
  try {
    const { name, email, dob, isActive } = req.body;

    const tempUserObject = {
      name,
      email,
      dob,
      isActive,
    };

    const newUser = new User(tempUserObject);
    const data = await newUser.save();

    res.status(200).json({ error: false, message: 'User Added', data });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: true, message: 'Internal Server Error', errorobj: error });
  }
});



/**
 * @openapi
 * /getUser/{offset}/{limit}:
 *   get:
 *     summary: Retrieve paginated list of users with limt
 *     description: Returns a paginated list of users. The optional `offset` parameter specifies the page number.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: offset
 *         in: path
 *         description: Page number for pagination (defaults to 1 if not provided)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - name: limit
 *         in: path
 *         description: Limit how many record needs to be fetched in a page (defaults to 5 if not provided)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 5
 *           example: 5
 *           
 *     responses:
 *       '200':
 *         description: Successful response with paginated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 paginationInfo:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: nusarat
 *                       email:
 *                         type: string
 *                         example: nusarat@example.com
 *                       dob:
 *                         type: string
 *                         format: date
 *                         example: '1990-01-01'
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       '401':
 *         description: Invalid page number
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
 *                   example: Invalid page number
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
 *                 errorobj:
 *                   type: object
 */
router.get('/getUser/:offset?/:limit?', async (req: Request<{ offset?: string,limit?: string }>, res: Response) => {
  try {
    console.log(req.params?.offset)
    const page = parseInt(req.params?.offset || '1', 10);
    const limit = parseInt(req.params?.limit || '5', 10) ;

    const startIndex = (page - 1) * limit;

    const totalUser = await User.countDocuments();

    const paginationInfo = {
      currentPage: page,
      totalPages: Math.ceil(totalUser / limit),
    };

    if (page > paginationInfo.totalPages) {
      res.status(401).json({ error: true, message: 'Invalid page number', paginationInfo });
      return;
    }

    const users = await User.find({}).skip(startIndex).limit(limit);

    res.status(200).json({
      error: false,
      users,
      paginationInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: true, message: 'Internal Server Error', errorobj: error });

  }
});


/**
 * @openapi
 * /updateWithPutById/{id}:
 *   put:
 *     summary: Replaces a user by ID.
 *     description: Fully replaces an existing user's data. All fields (name, email, dob, and isActive) must be provided; otherwise, the request will fail.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to replace.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *                 example: Nusarat
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *                 example: nusarat@example.com
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the user.
 *                 example: 1990-01-01
 *               isActive:
 *                 type: boolean
 *                 description: Indicates if the user is active.
 *                 example: true
 *     responses:
 *       200:
 *         description: User replaced successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 userToUpdate:
 *                   $ref: '#/components/schemas/AddUserRequestBody'
 *                 userAfterUpdate:
 *                   $ref: '#/components/schemas/AddUserRequestBody'
 *       401:
 *         description: Missing or invalid data provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errorobj:
 *                   type: object
 */
router.put('/updateWithPutById/:id',async (req:Request<{id:string},{},AddUserRequestBody>,res:Response)=>{
  try{

    const id = req.params.id;

    const { name, email, dob, isActive } = req.body;

    if (!name || !email || !dob || isActive === undefined) {
      res.status(401).json({ error: true, message: "All fields (name, email, dob, isActive) are required." });
      return;
    }



    const userToUpdate = await User.findByIdAndUpdate(id,req.body);

    if(!userToUpdate){
      res.status(401).json({ error: true, message: `no user found with given id ${id}` });
      return;
    }

    const userAfterUpdate = await User.findById(id)

    
    res.status(200).json({
      error:false,
      message:"user updated",
      userToUpdate,
      userAfterUpdate
    })

  }catch(error){
    console.error(error);
    res.status(400).json({ error: true, message: 'Internal Server Error', errorobj: error });
   
  }
})



/**
 * @openapi
 * /updateWithPatchById/{id}:
 *   patch:
 *     summary: Partially updates a user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to partially update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddUserRequestBody'
 *     responses:
 *       200:
 *         description: User partially updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedUser:
 *                   $ref: '#/components/schemas/AddUserRequestBody'
 *       401:
 *         description: No user found with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errorobj:
 *                   type: object
 */
router.patch('/updateWithPatchById/:id', async (req: Request<{ id: string }, {}, Partial<AddUserRequestBody>>, res: Response) => {
  try {
    const id = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      res.status(401).json({ error: true, message: `No user found with the given ID: ${id}` });
      return;
    }

    res.status(200).json({
      error: false,
      message: "User partially updated",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: true, message: 'Internal Server Error', errorobj: error });
  
  }
});


/**
 * @openapi
 * /getUserById/{id}:
 *   get:
 *     summary: get user by id.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id of the user to be fetched.
 *     responses:
 *       200:
 *         description: user is fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/AddUserRequestBody'
 *       401:
 *         description: No user found with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errorobj:
 *                   type: object
 */
router.get("/getUserById/:id",async (req:Request<{id:string}>,res:Response)=>{
  try{
    const id = req.params.id;
    const user = await User.findById(id)

    if(!user){
      res.status(401).json({ error: true, message: `No user found with the given ID: ${id}` });
      return;
    }

    res.status(200).json({
      error: false,
      message: "user is fetched successfully",
      user,
    });

  }catch(error){

    console.error(error);
    res.status(400).json({ error: true, message: 'Internal Server Error', errorobj: error });
  }
})



export default router;

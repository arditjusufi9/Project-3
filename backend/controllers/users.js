const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const secretToken = process.env.SECRET_TOKEN;
// const multer=require('multer')

const createUsers = async (req, res) => {
    try {
      const { firstName, lastName, email, password, rolecode } = req.body;
  
      if (rolecode !== undefined && rolecode === 1234) {
        const createAdminUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password,
            role: "ADMIN",
          },
        });
        res.json(createAdminUser);
      } else {
        const createCustomerUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password,
            role: "CUSTOMER",
          },
        });
        res.json(createCustomerUser);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error!");
    }
  };
  

  const updateUser = async (req, res) => {
    const { requesterId, targetUserId, firstName, lastName, email, password } = req.body;
  
    try {
      const requester = await prisma.user.findUnique({
        where: { id: Number(requesterId) },
      });
  
      const targetUser = await prisma.user.findUnique({
        where: { id: Number(targetUserId) },
      });
  
      if (!requester || !targetUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (requester.role === 'ADMIN') {
        const updatedUser = await prisma.user.update({
          where: { id: Number(targetUserId) },
          data: {
            firstName,
            lastName,
            email,
            password,
          },
        });
  
        return res.json(updatedUser);
      } else {
        if (requester.id !== targetUser.id) {
          return res.status(403).json({ error: 'Forbidden: You can only update your own details' });
        }
  
        const updatedCustomer = await prisma.user.update({
          where: { id: Number(targetUserId) },
          data: {
            firstName,
            lastName,
            email,
            password,
          },
        });
  
        return res.json(updatedCustomer);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };



  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
  
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, secretToken, {
        expiresIn: '1h',
      });
  
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };





const deleteUserByEmail = async (req, res) => {
    const { requesterId, targetUserEmail } = req.body;
  
    try {
      const requester = await prisma.user.findUnique({
        where: { id: Number(requesterId) },
      });
  
      const targetUser = await prisma.user.findUnique({
        where: { email: targetUserEmail },
      });
  
      if (!requester || !targetUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (requester.role === 'ADMIN') {
        const deletedUser = await prisma.user.delete({
          where: { email: targetUserEmail },
        });
  
        return res.json(deletedUser);
      } else {
        if (requester.id !== targetUser.id) {
          return res.status(403).json({ error: 'Forbidden: You can only delete your own details' });
        }
  
        const deletedCustomer = await prisma.user.delete({
          where: { email: targetUserEmail },
        });
  
        return res.json(deletedCustomer);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  


  const multer = require('multer');
  const path = require('path');
  
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage }).single('image');

const createProduct = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: 'Failed to upload image', multerError: err.message });
      } else if (err) {
        return res.status(500).json({ error: 'Unknown error occurred', multerError: err.message });
      }

      const { user } = req;
      if (!(user && user.role === 'ADMIN')) {
        console.log('Not authorized');
        return res.status(403).send('Forbidden');
      }

      const { name, description } = req.body;
      let price = parseFloat(req.body.price);
      let quantity = parseInt(req.body.quantity);
      if (isNaN(price) || isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid price or quantity format' });
      }

      const imagePath = req.file ? req.file.path : null;

      try {
        const createdProduct = await prisma.product.create({
          data: {
            name,
            description,
            price,
            quantity,
            image: imagePath,
          },
        });

        res.status(201).json(createdProduct);
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ error: 'Failed to create product in database', dbError: dbError.message });
      }
    });
  } catch (catchError) {
    console.error('Catch block error:', catchError);
    res.status(500).json({ error: 'Catch block error occurred', catchError: catchError.message });
  }
};


// const updateProduct = async (req, res) => {
//   try {
//     const { user } = req;
//     const productId = req.params.productId; 

//     if (user && user.role === "ADMIN") {
//       const { name, description, price, quantity } = req.body;

      
//       const existingProduct = await prisma.product.findUnique({
//         where: {
//           id: parseInt(productId), 
//         },
//       });

//       if (!existingProduct) {
//         return res.status(404).json({ error: 'Product not found' });
//       }

//       let updatedProductData = {
//         name,
//         description,
//         price,
//         quantity,
//       };

      
//       if (req.file) {
        
//         const imageUrl = ;
//         updatedProductData = { ...updatedProductData, imageUrl };
//       }

      
//       const updatedProduct = await prisma.product.update({
//         where: {
//           id: parseInt(productId),
//         },
//         data: updatedProductData,
//       });

//       return res.status(200).json(updatedProduct);
//     } else {
//       console.log("Not authorized");
//       return res.status(403).send("Forbidden");
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to update product' });
//   }
// };





  // const storage = multer.memoryStorage();
  // const upload = multer({ storage: storage }).single('image');
  
  const getAllProducts = async (req, res) => {
    try {
      const products = await prisma.product.findMany(); 
  
      res.status(200).json(products);
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({ error: 'Failed to fetch products from database', dbError: dbError.message });
    }
  };



  const deleteProduct = async (req, res) => {
    try {
      const { user } = req;
      console.log('User:', user);
      if (!(user && user.role === 'ADMIN')) {
        console.log('Not authorized');
        return res.status(403).send('Forbidden');
      }
  
      const productId = req.params.productId;
  
      try {
        const deletedProduct = await prisma.product.delete({
          where: {
            id: parseInt(productId), 
          },
        });
  
        if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
  
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ error: 'Failed to delete product from database', dbError: dbError.message });
      }
    } catch (catchError) {
      console.error('Catch block error:', catchError);
      res.status(500).json({ error: 'Catch block error occurred', catchError: catchError.message });
    }
  };
  

const addProductToCart = async (userId, productId, quantity) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!user || !product) {
      throw new Error('User or product not found');
    }

    const existingCartItem = await prisma.shoppingCart.findFirst({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    if (existingCartItem) {
     
      const newQuantity = existingCartItem.quantity + quantity;
      console.log(`Product already exists in your cart. Quantity: ${newQuantity}`);
      await prisma.shoppingCart.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.shoppingCart.create({
        data: {
          userId: user.id,
          productId: product.id,
          quantity,
        },
      });
    }

    return 'Product added to cart successfully';
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw new Error('Failed to add product to cart');
  }
};

const shoppingCart = async (req, res) => {
  try {
    const  {user}  = req;
    const { productId, quantity } = req.body;
    
    if (!user ) {
      return res.status(400).send("User ID is missing");
      
    }
   
    const shoppingCart = await prisma.shoppingCart.create({
      data: {
        userId: user.id,
        productId,
        quantity,
      },
    });

    res.json(shoppingCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
};









    module.exports={
        createUsers,
        updateUser,
        deleteUserByEmail,
        loginUser,
        createProduct,
        getAllProducts,
        deleteProduct,
        // addProductToCart,
        shoppingCart
    }
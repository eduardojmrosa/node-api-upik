import express, { json } from "express";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

//Firebase Setup
const firebaseConfig = {
//Firebase credentials
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const collectionRefWishLists = collection(db, "wishlists");
//--------------------------------------------------------------------
//Propriedades da requisição  e express Setup
const app = express();
app.use(json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  // Permite os métodos de solicitação específicos
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  // Permite os cabeçalhos específicos da solicitação
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log(`Request Type: ${req.method}`);
  console.log(`Content Type: ${req.headers["content-type"]}`);
  console.log(`Date: ${new Date()}`);
  next();
});
//--------------------------------------------------------------------
//Cria em uma coleção um documento, pode também adicionar uma nova coleção
app.post("/wishlists", async (req, res) => {
  const data = req.body;
  try {
    await setDoc(doc(collectionRefWishLists), data);
    res.status(201).send("Criado com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Softdelete de uma wishlist
app.patch("/wishlists/:id", async (req, res) => {
  const { id } = req.params;
  const data = { deleted: true };
  try {
    await updateDoc(doc(collectionRefWishLists, id), data);
    res.status(201).send("Removido com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
///Atualiza, em uma coleção, um documento específico
app.patch("/wishlist/:wishlistId/update/:productUuid", async (req, res) => {
  try {
    const { wishlistId, productUuid } = req.params;
    const { title, url } = req.body;
    const docRef = doc(db, "wishlists", wishlistId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const wishlistData = snapshot.data();
      const products = wishlistData.products || [];

      // Encontra o produto com base no productUuid
      const productIndex = products.findIndex(
        (product) => product.uuid === productUuid
      );

      if (productIndex !== -1) {
        const updatedProducts = [...products];
        updatedProducts[productIndex].title = title;
        updatedProducts[productIndex].url = url;

        // Atualiza a lista de produtos da lista de desejos
        const updatedData = {
          products: updatedProducts,
        };

        await updateDoc(docRef, updatedData);
        res.status(201).send("Produto atualizado com sucesso");
      } else {
        res.status(404).send("Produto não encontrado");
      }
    } else {
      res.status(404).send("Lista de desejos não encontrada");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//Busca uma lista de documentos de uma coleção colocando id em cada documento
app.get("/wishlists", async (req, res) => {
  try {
    const wishListsSnapshot = await getDocs(collectionRefWishLists);
    const list = wishListsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(wishListsSnapshot.docs);
    res.send(list);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Faz um soft delete em produtos de uma wishlist
app.patch("/wishlist/:wishlistId/:productUuid", async (req, res) => {
  try {
    const { wishlistId, productUuid } = req.params; // Obtém os IDs dos parâmetros
    const docRef = doc(db, "wishlists", wishlistId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const wishlistData = snapshot.data();
      const products = wishlistData.products || [];

      // Encontra o produto com base no productUuid
      const productIndex = products.findIndex(
        (product) => product.uuid === productUuid
      );

      if (productIndex !== -1) {
        const updatedProducts = [...products];
        updatedProducts[productIndex].deleted = true;

        // Atualiza o campo deleted do produto
        const updatedData = {
          products: updatedProducts,
        };

        await updateDoc(docRef, updatedData);
        res.status(201).send("Atualizado com sucesso");
      } else {
        res.status(404).send("Produto não encontrado");
      }
    } else {
      res.status(404).send("Lista de desejos não encontrada");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Ouvindo porta: ${port}`);
});

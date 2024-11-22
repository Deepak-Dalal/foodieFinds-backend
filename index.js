const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const port = 3000;

app.use(cors());

let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function getAllRestaurants() {
  const query = 'SELECT * from restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    const result = await getAllRestaurants();

    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No restaurants found' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getRestaurantById(id) {
  const query = 'SELECT * from restaurants where id = ?';
  let response = await db.all(query, [id]);

  return response;
}

app.get('/restaurants/details/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await getRestaurantById(id);

    if (result.length === 0) {
      res.status(404).json({ message: 'No restaurant found with id ' + id });
    } else {
      res.status(200).json({ restaurant: result[0] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getRestaurantsWithGivenCuisine(cuisine) {
  const query = 'SELECT * from restaurants where cuisine = ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  const cuisine = req.params.cuisine;
  try {
    const result = await getRestaurantsWithGivenCuisine(cuisine);

    if (result.restaurants.length === 0) {
      res
        .status(404)
        .json({ message: 'No restaurants found with the cuisine ' + cuisine });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getRestaurantsWithGivenFilters(
  isVeg,
  hasOutdoorSeating,
  isLuxury
) {
  const query =
    'SELECT * from restaurants where isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  const hasOutdoorSeating = req.query.hasOutdoorSeating;
  const isLuxury = req.query.isLuxury;
  try {
    const result = await getRestaurantsWithGivenFilters(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );

    if (result.restaurants.length === 0) {
      res
        .status(404)
        .json({ message: 'No restaurants found with given filters' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAllRestaurantsSortedByRating() {
  const query = 'SELECT * from restaurants ORDER BY rating desc';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const result = await getAllRestaurantsSortedByRating();

    if (result.restaurants.length === 0) {
      res.status(404).json({ message: 'No restaurants found' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAllDishes() {
  const query = 'SELECT * from dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    const result = await getAllDishes();

    if (result.dishes.length === 0) {
      res.status(404).json({ message: 'No dishes found' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getDishById(id) {
  const query = 'SELECT * from dishes where id = ?';
  let response = await db.all(query, [id]);

  return response;
}

app.get('/dishes/details/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await getDishById(id);

    if (result.length === 0) {
      res.status(404).json({ message: 'No dish found with id ' + id });
    } else {
      res.status(200).json({ dish: result[0] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getDishesWithGivenFilter(isVeg) {
  const query = 'SELECT * from dishes where isVeg = ?';
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  try {
    const result = await getDishesWithGivenFilter(isVeg);

    if (result.dishes.length === 0) {
      res.status(404).json({ message: 'No dishes found with given filter' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAllDishesSortedByPrice() {
  const query = 'SELECT * from dishes ORDER BY price';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const result = await getAllDishesSortedByPrice();

    if (result.dishes.length === 0) {
      res.status(404).json({ message: 'No dishes found' });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to FoodieFinds backend');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

var dog,sadDog,happyDog;


function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  createCanvas(1000,400);
  
  database = firebase.database();

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  addFoodButton = createButton("Add Food");
  addFoodButton.position(800, 95);
  addFoodButton.mousePressed(addFood);

  feedButton = createButton("Feed the Dog");
  feedButton.position(700, 95);
  feedButton.mousePressed(feedDog);

  foodObject = new Food();
  foodStock = database.ref('food');
  foodStock.on("value", readStock);

}

function draw() {
  background(46,139,87);
  fill("black");
  textSize(20);
  lastFeedTime = database.ref('lastFeedTime');
  lastFeedTime.on("value", function(data) {
    lastFeedTime = data.val(); 
  })

  if (lastFeedTime >= 12) {
    text("Last Feed: " + lastFeedTime%12 + "PM", 300, 30);
  }
  else if (lastFeedTime === 0) {
    text("Last Feed: 12AM", 300, 30);
  }
  else {
    text("Last Feed: " + lastFeedTime + "AM", 300, 30);
  } 

  foodObject.display();

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foods = data.val();
  foodObject.updateFoodStock(foods);
}

//function to update food stock and last fed time
function feedDog() {
  dog.addImage(happyDog);
  if (foodObject.getFoodStock() <= 0) {
    foodObject.updateFoodStock(foodObject.getFoodStock() * 0);
  }
  else {
    foodObject.updateFoodStock(foodObject.getFoodStock() - 1);
  }
  database.ref('/').update({
    food: foodObject.getFoodStock(),
    lastFeedTime: hour(),

  })
}

//function to add food in stock
function addFood() {
  foods++;
  database.ref('/').update({
    food: foods
  })
}
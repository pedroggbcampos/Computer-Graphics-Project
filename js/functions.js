function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function speedup(){
    console.log("speedinng")
    for (var ball in balls_in_field)
      balls_in_field[ball].add_velocity(1.5);
    setTimeout("speedup()",30000) //resets timer to 30 sec
}

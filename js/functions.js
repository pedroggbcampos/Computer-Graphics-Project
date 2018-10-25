function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function speedup(){
    console.log("speedinng")
    for (var ball in balls_in_field)
      balls_in_field[ball].change_velocity(3);


    setTimeout("speedup()",30000)
}

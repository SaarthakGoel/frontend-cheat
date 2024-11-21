export function getPlayerPositions(num){
  console.log(num)
   if(num === 2){
    const ans =  [
      { colStart: 3, rowStart: 1 },
      { colStart: 9, rowStart: 1 }
    ];
    return ans
   }else if(num === 3){
    const ans =  [
      { colStart: 2, rowStart: 1 },
      { colStart: 6, rowStart: 1 },
      { colStart: 10, rowStart: 1 },
    ];
    return ans
   }else if(num === 4){
    const ans =  [
      { colStart: 1, rowStart: 3 },
      { colStart: 4, rowStart: 1 },
      { colStart: 8, rowStart: 1 },
      { colStart: 11, rowStart: 3 },
    ];
    return ans
   }else{
    const ans =  [
      { colStart: 1, rowStart: 3 },
      { colStart: 3, rowStart: 1 },
      { colStart: 6, rowStart: 1 },
      { colStart: 9, rowStart: 1 },
      { colStart: 11, rowStart: 3 },
    ];
    return ans
   }
} 
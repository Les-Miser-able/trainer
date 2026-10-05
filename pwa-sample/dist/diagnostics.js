export const HAND_EDGES=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];

export function describeFrame(frame){
  const hands=[];
  for(let slot=0;slot<2;slot++)if(frame[126+slot]){
    const points=Array.from({length:21},(_,j)=>({x:frame[slot*63+j*3],y:frame[slot*63+j*3+1]}));
    const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
    hands.push({slot:slot?'right':'left',width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys),
      clipped:points.some(p=>p.x<.02||p.x>.98||p.y<.02||p.y>.98)});
  }
  return hands;
}

// Each explicit capture is one trial; never count every correlated video frame as a test sample.
export function webcamReport(trials,classes){
  const matrix=classes.map(()=>classes.map(()=>0));
  let correct=0,accepted=0,acceptedCorrect=0;
  for(const trial of trials){
    const actual=classes.indexOf(trial.actual),predicted=classes.indexOf(trial.predicted);
    if(actual<0||predicted<0)throw new Error('Unknown trial class.');
    matrix[actual][predicted]++;
    correct+=Number(actual===predicted);
    if(trial.confidence>=.6){accepted++;acceptedCorrect+=Number(actual===predicted);}
  }
  return {classes,confusion_matrix_rows_true_columns_predicted:matrix,
    accuracy:trials.length?correct/trials.length:null,samples:trials.length,
    accepted,uncertain:trials.length-accepted,coverage:trials.length?accepted/trials.length:null,
    accepted_accuracy:accepted?acceptedCorrect/accepted:null,
    evaluation:'User-labeled webcam trials; raw top-1 predictions, including uncertain trials. Not an independent benchmark.',trials};
}

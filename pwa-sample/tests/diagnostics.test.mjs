import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFrame,webcamReport} from '../dist/diagnostics.js';
test('webcam accuracy counts uncertain errors and preserves matrix direction',()=>{
 const report=webcamReport([{actual:'A',predicted:'B',confidence:.4},{actual:'B',predicted:'B',confidence:.9}],['A','B']);
 assert.deepEqual(report.confusion_matrix_rows_true_columns_predicted,[[0,1],[0,1]]);
 assert.equal(report.accuracy,.5);assert.equal(report.coverage,.5);assert.equal(report.accepted_accuracy,1);
 assert.equal(webcamReport([],['A']).accuracy,null);
});
test('landmark diagnostics ignore absent slots and identify frame edges',()=>{
 const f=new Float32Array(128);assert.deepEqual(describeFrame(f),[]);
 f[126]=1;f[3]=.5;
 const [hand]=describeFrame(f);assert.equal(hand.slot,'left');assert.equal(hand.width,.5);assert.equal(hand.clipped,true);
});

import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import { Coords3D } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";

const drawMask = (
  ctx: CanvasRenderingContext2D,
  keypoints: Coords3D,
) => {
  const reversePoints = keypoints.map(point=> {
    return [480-point[0], point[1], point[2]]
  })
  const lips = [61,185,40,39,37,0,267,269,270,409,291,306,292,308,415,310,311,312,13,82,81,80,191,78,62,76,61]
  const lowerLips = [61,146,91,181,84,17,314,405,321,375,291,306,308,324,318,402,317,14,87,178,88,95,78,62,76,61]
  for (let i = 0; i < lips.length; i++) {
    ctx.lineTo(
      reversePoints[lips[i]][0],
      reversePoints[lips[i]][1]
    );
  }

  for (let i = 0; i < lowerLips.length; i++) {
    ctx.lineTo(
      reversePoints[lowerLips[i]][0],
      reversePoints[lowerLips[i]][1]
    );
  }
};

export const draw = (
  predictions: AnnotatedPrediction[],
  ctx: CanvasRenderingContext2D,
  lipColor: string
) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction: AnnotatedPrediction) => {
      const keypoints = prediction.scaledMesh;
      ctx.clearRect(0, 0, 480, 480);
      ctx.fillStyle = lipColor;
      ctx.save();
      ctx.beginPath();
      drawMask(ctx, keypoints as Coords3D);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }
};

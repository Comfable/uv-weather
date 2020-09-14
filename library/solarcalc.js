
//

declanationOfTheSun = Math.Asin(-0.39795 * Math.Cos(2.0 * Math.PI * (numberOfDaysSinceFirstOfJanuary + 10.0) / 365.0));

sinSunPosition = Math.Sin(latituteInRadians) * Math.Sin(declanationOfTheSun);
cosSunPosition = Math.Cos(latituteInRadians) * Math.Cos(declanationOfTheSun);

sinSunHeight = sinSunPosition + cosSunPosition * Math.Cos(2.0 * Math.PI * (numberOfMinutesThisDay + 720.0) / 1440.0) + 0.08;

sunCorrection = 1370.0 * (1.0 + (0.033 * Math.Cos(2.0 * Math.PI * dayNumberOfYear);));

CalculateMaximumSolarRadiationInternal(sinSunHeight, sunCorrection){
   if ((sinSunHeight > 0.0) && Math.Abs(0.25 / sinSunHeight) < 50.0)
   {
      maximumSolarRadiation = sunCorrection * sinSunHeight * Math.Exp(-0.25 / sinSunHeight);
   }
   else
   {
      maximumSolarRadiation = 0;
   }

   return maximumSolarRadiation;
}
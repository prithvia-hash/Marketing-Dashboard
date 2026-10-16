// All figures taken from Marketing_Expenditure_FY_26_V6.pdf (Rs., till Sep-26). Edit here to update the dashboard.
const D = {
 months:["Apr","May","Jun","Jul","Aug","Sep"],
 yap:[4635411.52,2534060,3067896.6,2151420.74,916322,765600],
 kom:[3429763.65,2604048,3224230.75,3073788.58,2744400,2463240],
 cpb:{Yapral:[5.8,12.7,7.7,4.3,1.2,1.3],Kompally:[8.6,26,10.8,4.4,9.2,0],Overall:[6.7,17.1,9,4.4,3.3,5.4]},
 kpi:{Overall:["3,16,10,182","24,020","5,96,419","309.87"],Yapral:["1,40,70,711","23,768","4,13,844","211.95"],Kompally:["1,75,39,471","24,226","9,23,130","492.34"]},
 cat:{"Online Marketing (Lead Gen)":[8346800,12285852],"Consultants":[2118960,1344600],"Misc.":[1962616.85,1099000],"Online Marketing (Branding)":[526448,2318096],"Hoarding":[424230,405280],"Offline Branding & Promo":[778298-0,0],"Property Portals":[0,0]},
 proj:{OGL:17539470.98,OP:7174510.24,OH:4209256.92,GRY:1965070.03,OB:714672.3,OD:8689.98,OG:163.25,OSP:0,MB:0,OS:-1651.85},
 pname:{OGL:"Om Sree Gallaxy",OP:"Om Sree Prithvi",OH:"Om Sree Heights",GRY:"Om Sree Glory",OB:"Om Sree Brilliance",OD:"Om Sree Delight",OG:"Om Sree Grand",OSP:"Om Sree Sky Park",MB:"Om Sree Madhuban",OS:"Om Sree Signet"},
 region:{OGL:"Kompally",OSP:"Kompally",MB:"Kompally",OP:"Yapral",OH:"Yapral",GRY:"Yapral",OB:"Yapral",OD:"Yapral",OG:"Yapral",OS:"Yapral"},
 perProj:[["Om Sree Brilliance",6806.4,238224.1,109.53],["Om Sree Madhuban",0,null,null],["Om Sree Delight",119.04,8689.98,3.84],["Om Sree Grand",40.81,null,null],["Om Sree Gallaxy",29778.39,1461622.58,871.09],["Om Sree Sky Park",0,0,0],["Om Sree Glory",115592.35,491267.51,187.94],["Om Sree Heights",89558.66,701542.82,326.3],["Om Sree Prithvi",24403.1,358725.51,209.54]],
 visits:[["Hoarding",748,25,48259],["Online Marketing (Lead Gen)",508,21,40675],["Online Marketing (Branding)",49,0,0],["Property Portals",10,7,13077],["Offline Branding",1,0,0],["Misc.",0,0,0],["Consultants",0,0,0]],
 qtr:[["Om Sree Brilliance",710583.07,4089.23],["Om Sree Madhuban",0,0],["Om Sree Delight",5953.55,2736.43],["Om Sree Grand",163.25,0],["Om Sree Gallaxy",9258042.41,8281428.58],["Om Sree Sky Park",0,0],["Om Sree Signet",-994.66,-657.19],["Om Sree Glory",1705561.82,259508.2],["Om Sree Heights",1827668.41,2381588.51],["Om Sree Prithvi",5988432.69,1186077.55]],
 pay:{months:["Mar","Apr","May","Jun","Jul","Aug","Sep"],v:[186494,5684038,4280268,6227549,7025510,6148409,5910926],
  cat:{"Online Marketing (Lead Gen)":30763212,"#N/A":11566322,"Misc.":9923450,"Consultants":6470822,"Online Marketing (Branding)":6087960,"Hoarding":3693574,"Offline Branding":984578},
  region:{Kompally:19032568,Yapral:16430626}},
 other:{Manpower:11168,"Security & Housekeeping":429702,Electricity:1959782.74,Administrative:0,
  sec:{"B1.1 Prithvi":138020,"B1.4 Madhuban":129792,"B1.3 Sky Park":88742,"B1.2 Gallaxy":73148},
  ele:{"Gallaxy Sales Office":834274,"Prithvi Sales Office":827170.64,"Sky Park Sales Office":173834.1,"Madhuban Sales Office":124504}}
};

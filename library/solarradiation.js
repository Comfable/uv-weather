function srad = solarradiation(dem,lat,cs,r)
//srad is the solar radiation in W/m2 over one year per grid cell
// EXAMPLE:
//       srad = solarradiation(peaks(50)*100,54.9:-0.1:50,1000,0.2);
//       - calculates the solar radiation for an example 50x50 peak surface.

//It ;               // total hours of daily sunshine (calculated inline)
//M ;                // air mass ratio parameter (calculated inline)
//r = 0.20;          // ground reflectance coefficient (more sensible to give as input)
//L=lat;             //latitude
n = 1;              // timestep of calculation over sunshine hours: 1=hourly, 0.5=30min, 2=2hours etc
tau_a = 365;     //length of the year in days
S0 = 1367;          // solar constant W m^-2   default 1367

dr = 0.0174532925;

[slop,asp]=get_ders(dem,cs);
[dummy,L]=meshgrid(1:size(dem,2),lat);
clear dummy;
L=L*dr;
fcirc = 360*dr;

srad=0;
sinL=sin(L);
cosL=cos(L);
tanL=tan(L);
sinSlop=sin(slop);
cosSlop=cos(slop);
cosSlop2=cosSlop.*cosSlop;
sinSlop2=sinSlop.*sinSlop;
sinAsp=sin(asp);
cosAsp=cos(asp);
term1 = ( sinL.*cosSlop - cosL.*sinSlop.*cosAsp);
term2 = ( cosL.*cosSlop + sinL.*sinSlop.*cosAsp);
term3 = sinSlop.*sinAsp;

for d = 1:tau_a; 
    I0 = S0 * (1 + 0.0344*cos(fcirc*d/tau_a));  
    dS = 23.45 * dr* sin(fcirc * ( (284+d)/tau_a ) );
    hsr = real(acos(-tanL*tan(dS)));
    It=round(12*(1+mean(hsr(:))/pi)-12*(1-mean(hsr(:))/pi));
    I=0;
    for t=1:n:It
        hs=hsr-(pi*t/It);
        sinAlpha = sinL.*sin(dS)+cosL.*cos(dS).*cos(hs);
        M=sqrt(1229+((614.*sinAlpha)).^2)-614.*sinAlpha;
        tau_b = 0.56 * (exp(-0.65*M) + exp(-0.095*M));
        tau_d = 0.271-0.294*tau_b;
        tau_r = 0.271+0.706*tau_b;
        cos_i = (sin(dS).*term1) + (cos(dS).*cos(hs).*term2) + (cos(dS).*term3.*sin(hs));
        Is = I0 * tau_b;
        R = Is .* cos_i;
        R(R<0)=0;
        Id = I0 .* tau_d .* cosSlop2./ 2.*sinAlpha;
        Ir = I0 .* r .* tau_r .* sinSlop2./ 2.* sinAlpha;
        R= R + Id + Ir;
        R(R<0)=0; 
        I=I+R;
    srad = srad + I;


function [grad,asp] = get_ders(dem,cs)
[fx,fy] = gradient(dem,cs,cs);
[asp,grad]=cart2pol(fy,fx);
grad=atan(grad);
asp=asp.*-1+pi;

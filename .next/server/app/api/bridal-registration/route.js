"use strict";(()=>{var e={};e.id=507,e.ids=[507],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},66221:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>c,patchFetch:()=>u,requestAsyncStorage:()=>x,routeModule:()=>d,serverHooks:()=>g,staticGenerationAsyncStorage:()=>f});var i={};r.r(i),r.d(i,{POST:()=>l});var a=r(49303),o=r(88716),s=r(60670),n=r(87070);let p=new(r(82591)).R(process.env.RESEND_API_KEY);async function l(e){try{let{name:t,email:r,whatsapp:i,weddingDate:a,guestCount:o,howHeard:s}=await e.json();if(!t||!r||!i)return n.NextResponse.json({error:"Missing required fields"},{status:400});return await p.emails.send({from:"Bridal Experience <noreply@karlotagourmet.com>",to:"bridalexperiencebykarlota@gmail.com",subject:`💍 New Pre-Registration — ${t}`,html:`
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #FAF0E6; padding: 40px 32px; border-radius: 4px;">
          <div style="text-align: center; margin-bottom: 28px;">
            <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #C9A84C; margin: 0 0 6px;">BRIDAL EXPERIENCE BY KARLOTA</p>
            <h1 style="font-size: 24px; color: #3B2A1A; margin: 0;">New Pre-Registration 💍</h1>
          </div>

          <div style="background: #3B2A1A; border-radius: 4px; padding: 28px 32px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">Name</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${t}</td>
              </tr>
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">Email</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${r}</td>
              </tr>
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">WhatsApp</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${i}</td>
              </tr>
              ${a?`
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">Wedding Date</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${a}</td>
              </tr>`:""}
              ${o?`
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">Est. Guests</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${o}</td>
              </tr>`:""}
              ${s?`
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">How They Heard</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${s}</td>
              </tr>`:""}
            </table>
          </div>

          <div style="text-align: center;">
            <a href="https://wa.me/1${i.replace(/\D/g,"")}" style="display: inline-block; padding: 12px 28px; background: #25D366; color: white; font-family: 'Helvetica Neue', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 2px;">
              Reply on WhatsApp
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #C9A84C33; margin: 28px 0;" />
          <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; color: #7A5C4F; text-align: center; margin: 0;">
            Bridal Experience by Karlota \xb7 June 7, 2025 \xb7 Orlando, FL
          </p>
        </div>
      `}),n.NextResponse.json({success:!0})}catch(e){return console.error("bridal-registration error:",e),n.NextResponse.json({error:"Failed to send"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/bridal-registration/route",pathname:"/api/bridal-registration",filename:"route",bundlePath:"app/api/bridal-registration/route"},resolvedPagePath:"/Users/gordinfonseca/Downloads/karlota-gourmet/app/api/bridal-registration/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:x,staticGenerationAsyncStorage:f,serverHooks:g}=d,c="/api/bridal-registration/route";function u(){return(0,s.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:f})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[948,972,591],()=>r(66221));module.exports=i})();
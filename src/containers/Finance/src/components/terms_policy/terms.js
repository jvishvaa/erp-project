import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
// import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    maxWidth: 'sm'
  },
  media: {
    height: 140
  }
})

export default function MediaCard () {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      {/* <CardActionArea> */}
      <CardContent>
        <Typography variant='subtitle1' color='textSecondary' component='h4'>
          <ul>
            <li> INTERPRETATION
The term “terms” refers to terms and conditions, and terms of use.
The term “site” refers to the letseduvate website, portal, mobisite or any other such application as may be available in the future and, if inferred from the context, may also include any other website or part thereof, accessed through a link to our website or portal and shall include, but is not limited to, social media websites such as Facebook, LinkedIn, Twitter or any such site.
The terms “we”, “us” or “our” refer to letseduvate.
The term “you” refers to the user or viewer of the letseduvate site.
            </li><br />
            <li> GENERAL
By accepting these terms and conditions and by using the site, you indicate that you accept these terms and that you agree to abide by them. If you do not accept these terms, please leave the site immediately.
Use of the site is also subject to any additional application forms, policies or guidelines posted from time to time.
Letseduvate does not make any representation regarding any other websites which may be linked to or accessed through this site and accordingly accepts no responsibility for the content or use of such websites or information contained therein. letseduvate shall not be liable to any party for any form of loss or damage incurred as a result of any use of or reliance on any information contained on such website or any websites which can be accessed through this website.
This site is supplied on an “as is” basis and has not been compiled or supplied with the intention of meeting your individual requirements. It is your sole responsibility, as the user, to satisfy yourself, prior to making use of this site, that the service available from and through this site will meet your individual requirements and be compatible with your hardware and/or software.
            </li><br />
            <li>
AGE RESTRICTIONS
The site is not available for any person under the age of 18 without your parents/guardian’s consent.
If you are under 18 years old, your parent or guardian is required to consent to your use of this site and shall be required to accept these terms on your behalf.
Accordingly, letseduvate is indemnified from any and all liability in this regard, including any liability arising as a result of your failure, or someone acting on your behalf, to provide accurate information in this regard when required to do so through the use of this site.
            </li><br />
            <li> LIABILITY
We shall not be liable for any damage, loss or liability of whatsoever nature arising from the use or inability to use this site or the services or content provided from and through this site, or third party website accessed through this site. Furthermore, we make no representations or warranties, implied or otherwise, that, amongst others, the content and technology available from this site is free from errors or omissions or that the service will be uninterrupted and error-free
Letseduvate, or any other party (whether or not involved in creating, producing, maintaining or delivering the site or the portal), and any of the companies associated with letseduvate and the officers, directors, employees, shareholders or agents of any of them, exclude all liability and responsibility for any amount or kind of loss or damage that may result to you or a third party (including without limitation, any direct, indirect, punitive or consequential loss or damages, or any loss of income, profits, goodwill, data, contracts, use of money, or loss or damages arising from or connected in any way to business interruption, in connection with the site (including the User-Generated Content) in any way or connection with the use, inability to use or the results of use of the site (including the User-Generated Content), any sites linked to the site or the material on such sites, including but not limited to loss or damage due to viruses that may infect your computer equipment, software, data or other property on account of your access to, use of, or browsing the site (including the User-Generated Content) or your downloading of any material from the Site (including the User-Generated Content) or any sites linked to the site.
You agree to keep Letseduvate and its associates fully indemnified against any actual or contingent liabilities incurred in relation to any actions or claims brought by any person against letsduvate as a result of an actual or alleged breach by you of any law, or such other actions or claims brought in relation to the provision of services by letseduvate to you.
            </li><br />
            <li> SERVICE ACCESS
Letseduvate endeavours to ensure that the site is normally available 24 hours a day. Access to the site may be suspended temporarily and without notice in the case of system failure, maintenance or repair or for reasons beyond letseduvate’s control. Letseduvate shall not be liable if for any reason the site is unavailable at any time or for any period.
            </li><br />
            <li> INFORMATION ON THIS SITE
Information, ideas and opinions expressed on this site should not be regarded as professional advice or the official opinion of letseduvate. Users must seek advice before taking any action based on the contents of this site.
Letseduvate has not determined that the site content is suitable for any particular purpose and/or for a particular user whatsoever, other than as a general reference, and has not necessarily disclosed all risks relating to the site content or its subject matter. You should not rely on the site content for professional advice (including, but not limited to business, financial, investment, trading, or other advice) or as a basis for any investment, transactional or similar decisions you make or which are made on your behalf without first consulting with your preferred professional or business advisors (who may include your attorney, tax, accounting and investment advisors). No information or data on this site is an offer to do business (which upon acceptance by yourself will constitute a contract) but is merely an invitation to do business. No agreements shall be concluded merely by sending a data message to this site or its owners. Valid agreements require an acknowledgement of receipt of an offer, duly received from us.
            </li><br />
            <li> USER-GENERATED CONTENT AND CONDUCT
Any use of User-Generated Content by users other than for private, non-commercial research or study is strictly prohibited.
You are prohibited from posting or transmitting to or from the site, including letseduvate’s Facebook, Twitter, LinkedIn, Google+ and other social networking media, any material:
that is threatening, defamatory, obscene, indecent, seditious, offensive, pornographic, abusive, liable to incite racial hatred, discriminatory, menacing, scandalous, inflammatory, blasphemous, in breach of confidence, in breach of privacy or which may cause annoyance or inconvenience; or
for which you have not obtained all necessary licences and/or approvals; or
which constitutes or encourages conduct that would be considered a criminal offence, give rise to civil liability, or otherwise be contrary to the law of or infringe the rights of any third party, in any country in the world; or
which is technically harmful (including (but not limited to) computer viruses, logic bombs, Trojan horses, worms, harmful components, corrupted data or other malicious software or harmful data (together “Inappropriate User-Generated Content”).
Letseduvate shall fully co-operate with any law enforcement authorities or court order requesting or directing Letseduvate to disclose or identify or locate anyone posting any Inappropriate User-Generated Content.
Letseduvate accepts no responsibility for actively monitoring any forums, such as but not limited to Facebook, Twitter, LinkedIn and any such other forums as may come into existence, contained in the site for Inappropriate User-Generated Content. You agree that letseduvate accepts no liability whatsoever if we so choose from time to time to edit, restrict or remove the User-Generated Content.
            </li><br />
            <li> PORTALS
User access to any self – service portals hosted/accessed by Letseduvate facilities is subject to the following terms and conditions.

You are prohibited from sharing any login credentials to our site with a third party. You are responsible for maintaining the confidentiality of your account, profile and passwords, as applicable. You may not share your password or other account access information with any other party, temporarily or permanently, and you shall be responsible for all uses of your registrations and passwords, whether or not authorized by you. You agree to immediately notify letseduvate of any unauthorized use of your account, profile, or passwords.
The access and use of any chat-room, newsgroup, bulletin board, mailing list, transaction or another online forum available on this site, shall be governed by the guidelines for Online Conduct in these Terms and Conditions.
            </li><br />
            <li> INTELLECTUAL PROPERTY AND RESTRICTIONS OF USE
This site contains information which is owned by or is licensed to us, including but not limited to text, design, layout, graphics, organization, magnetic translation, digital conversion and other information related to the site. This information is protected under applicable intellectual property laws and reproduction, distribution, publication or any other use, either in whole or in part, other than in accordance with the next paragraph is strictly prohibited. You are granted a non-exclusive, non-transferable, revocable license to:
access and use this site strictly in accordance with these terms;
to use this site solely for personal, non-commercial and lawful purposes;
to download, copy, print screen, use, save or print out information from the site solely for personal, non-commercial purposes, provided that all copyright and other intellectual property notices therein are unchanged.
            </li><br />
            <li> LINKS TO AND FROM OTHER SITES
You may not create a link to this site from a third party site or document without our prior written consent.
Links to third party websites on the site are provided solely for your convenience. If you use these links, you leave the site. We have not reviewed all of these third-party websites and do not control and is not responsible for these websites or their content or availability. We, therefore, do not endorse or make any representations about them, or any material found there, or any results that may be obtained from using them. If you decide to access any of the third-party websites linked to the site, you do so entirely at your own risk.
If you would like to link to the site, you are required to obtain our written permission to do so, and you may only do so on the basis that you link to, but do not replicate, any page of the site, and subject to the following conditions:
you do not remove, distort or otherwise alter the size or appearance of letseduvate/eduvate logo or any of its related subsidiaries;
you do not in any way imply that we are endorsing any products or services other than our own;
you do not misrepresent your relationship with us nor present any other false information about letseduvate;
you do not otherwise use letseduvate/eduvate mark displayed on the site without express written permission from us;
you do not link from a site that you do not have the necessary authority or permission to link from; and
the site you are linking from does not contain content that is distasteful, offensive or controversial, infringes any intellectual property rights or other rights of letseduvate or any other person or otherwise does not comply with all applicable laws and regulations.
We expressly reserve the right to revoke the right granted in clause 10.3 for breach of these terms and to take any action we deem appropriate.
You shall fully indemnify us for any loss or damage suffered by letseduvate or any of its group companies for breach of clause 10.
            </li><br />
            <li> VARIATION OF TERMS
We reserve the right to modify these terms or information set out in the site at any time and will publish notice of any such modifications online. By continuing to access our site after notice of such modifications has been published, you agree to comply with and be bound by them.
            </li><br />
            <li> GUIDELINES FOR ONLINE CONDUCT
You agree to use the site in accordance with all applicable laws.
We respect the constitutional right to freedom of speech and encourage robust intellectual debate. Your right to free speech is subject to the provisions of the Constitution.
You agree not to post any advertising or any form of commercial solicitation, including, but not limited to, spamming anywhere on the site.
You agree not to post any content that contains viruses or other harmful items anywhere on the site.
We reserve the right to remove content, block access or take other action which we deem appropriate in the circumstances against any content which violates the above rules and guidelines.
If a third party claims that any material you have contributed to a site is unlawful, you will bear the burden of establishing that the material complies with all applicable laws.
You agree that you will not access or attempt to access any other user’s account, or misrepresent or attempt to misrepresent your identity while using the sites.
You agree that you will not restrict or inhibit any other user from using and enjoying the sites.
You agree that you are responsible for maintaining the confidentiality of your account and password, if any, and for restricting access to your computer, and agree to accept responsibility for all activities that occur under your account or password.
We respect the intellectual property of others. If you believe your copyright has been violated on a site hosted by us, please give notice at info@letseduvate.com. We will, upon receipt of such notice and confirmation that such copyright has been violated, use all reasonable means to remove the infringing content and inform the person that posted it of such removal and the reason therefore.
            </li><br />
            <li> APPLICABLE AND GOVERNING LAW
This site is hosted, controlled and operated from the Bangalore, Karnataka, India and Indian Law governs the use or inability to use this site and these terms and conditions of use. Courts in Bangalore, Karnataka have jurisdiction in the event of a dispute of any nature whatsoever arising between parties.
            </li><br />
            <li> PAYMENT TERMS AND CONDITIONS
Student/Parent has to enter the username and password and login into their page.
Once the Student/Parent is in their login page and press “online fees payment”, they can see the details of the fee dues.
If payment is to be made online, Click on "Pay online" and after the student login to the page with their user and name and password, you will be directed to the online portal, wherein you have to select your mode of payment such as credit card, debit card, Net Banking etc. Kindly follow the instructions as applicable to your choice of payment.
Once “Pay” - Option is selected you will be directed for payment through NET BANKING or DEBIT / CREDIT CARD. You can choose the desired payment option and proceed.
Payment process normally takes a few seconds to a minute and once the payment is successful, You will get a PAYMENT CONFIRMATION SLIP and the Student/Parent has to keep the same for reference.
In case the payment is not successful due to any reason you will get a display on the status of failure in payment.
In case none of the above two happens, and there is heavy delay in any response from the system - if you have not proceeded with payment and not given any BANK or CC particulars, you may proceed from the beginning again and start the payment process again
In case you have given all the DEBIT / CREDIT card details or NET BAKING authorization for payment, and have not got any response, please check with your bankers or credit card company and see if your account is debited. If your bank account/CC is debited, please don’t make any attempt to pay again. Student account will be credited automatically and you will get the receipt on Transaction + 2 date.
School accepts no responsibility for refusal or reversal of payments which are matters solely between the user of the service and the credit card provider.
The credit card information supplied when using this service is processed by the payment gateway of the service provider and is not supplied to the school. The only information supplied to the school is the name of the payer, the invoice or notice number, part of the credit card number and the amount of the payment. It is the sole responsibility of the user of this service to ensure that the information entered in the relevant fields is correct. It is recommended that you take and retain a copy of the transaction for record-keeping purposes, and to assist with the resolution of any disputes that may arise from the use of this service.
This service is provided using a payment gateway service provider through a secure website. However, the school will not be able to give any assurance that information provided online by a user may not be able to be read or intercepted by a third party. The school does not accept any liability in the event of the interception, "hacking" or other unauthorized access to information provided by a user of this service.
No warranty - No warranty, representation or guarantee, express or implied, is given by the school in respect of the operation of this service.
Disclaimer and Limitation of liability - School does not accept liability for any damage, loss, cost (including legal costs), expenses, indirect losses or consequential damage of any kind which may be suffered or incurred from the use of this service. The above disclaimer and limitation of liability operate only to the extent permitted by law.
While availing any of the payment method/s offered by us, the school is not responsible or takes no liability of whatsoever nature in respect of any loss or damage arising directly or indirectly to you out of the decline due to:<br />
• lack of authorization for any transaction/s,<br />
• exceeding the preset limit mutually agreed by you and between your "Bank/s"<br />
• any payment issues arising out of the transaction,<br />
• The decline of transaction for any other reason/s.<br />

Refund Policy: There is no refund(s)/ No Cancellations are allowed for the transactions done through this channel.
 In case of any dispute regarding the payments w.r.t <br />
 • School Fees: Please contact school administrator as per the details in the Receipt. <br />
 • Books/Uniform: Please contact School Shop Pvt Ltd as per the details in the Receipt.<br />
 • Any dispute or any refund or any cancellation queries will be reverted in three working days for school Payments by School Administration.<br />
 • Any dispute or any refund or any cancellation queries will be reverted in three working days for books and uniform by School Shop Pvt Ltd.<br />

 Shipping Policy for Books and Uniform(School Shop Pvt Ltd): <br />

 • We deliver the Stock to the school premises at no extra cost within two days as per the stock availability.<br />
 • For home delivery we only provide the option based on parents request and cost depends on the location and delivery  company.<br />

            </li>

          </ul>
        </Typography>
      </CardContent>
      {/* </CardActionArea> */}
    </Card>
  )
}

import Layout from "../components/layout";
import Checkout from "../components/pricing/Checkout";



export async function getServerSideProps(context)
{
    
    const u= context.query.uID;
    //const uID = userID.json();
    const s = context.query.sID;;
return{
    props : {uID:u,sID:s},
}
    
}

export default function CheckoutPage(uID,sID){
    return(
    <Layout>
        <Checkout 
         uID={uID}
          sID={sID}
        />
    </Layout>   
    )
}
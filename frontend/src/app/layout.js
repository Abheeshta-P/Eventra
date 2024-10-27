// app/layout.js
import { LayoutRender } from "@/components";
import '../global.css'

export const metadata = {
  title: 'Eventra',
  description: 'Event management portal for users and services',
}
   // at first when app loads get the user status
  //  const dispatch = useDispatch();
  // const [loading,setLoading] = useState(false);
     // when app loads useEffect is invoked
  //  useEffect (()=>{
  //    // check whether there is any logged in user
  //    authService.getCurrentUser().then(([userData, userType])  =>{
  //      // if userAccount is there show the logged in ui
  //      if (userData && userType){
  //        dispatch(login({userData,userType}));
  //      }
  //      else {
  //        dispatch(logout());
  //      }
  //    }). catch( error=>{
  //      console.log("page.jsx useEffect and getCurrentUser :: error",error);
  //    }).finally(()=>setLoading(false));
    
  //  },[])
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </head>

      
      <body className="bg-zinc-100 text-black">
      <LayoutRender>{children}</LayoutRender> 
      </body>
    </html>
  );
}

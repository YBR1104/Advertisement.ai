import { GhostButton, PrimaryButton } from './Buttons';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DollarSign, FolderEditIcon, GalleryHorizontalEnd, MenuIcon, SparkleIcon, XIcon } from 'lucide-react';
import { useClerk, UserButton, useUser,useAuth } from '@clerk/react';
import api from '../configs/axios';
import toast from 'react-hot-toast';

export default function Navbar() {
    const navigate = useNavigate() 
    const {user} = useUser()
    const {openSignIn,openSignUp} = useClerk()
    const [isOpen, setIsOpen] = useState(false);
    const [credits , setCredits] = useState(0);
    const {pathname} = useLocation()
    const {getToken} = useAuth()
    const navLinks = [
        { name: 'Home', href: '/#' },
        { name: 'Create', href: '/generate' },
        { name: 'Community', href: '/community' },
        { name: 'Plans', href: '/plan' },
    ];

    const getUserCredits = async () =>{
        try {
            const token = await getToken()
            const { data} = await api.get('/api/user/credits',{headers: {
                Authorization: `Bearer ${token}`
            }})
            setCredits(data.credits)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
            console.log(error);
            
        }
    }

    useEffect(()=>{
        if(user){
            (async ()=> await getUserCredits())();
        }
    },[user,pathname])
    return (
        <motion.nav className='fixed left-0 right-0 top-5 z-50 px-4'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
        >
            <div className='mx-auto flex max-w-6xl items-center justify-between rounded-full border border-gray-900/12 bg-white/90 px-5 py-2.5 shadow-[0_12px_28px_rgba(15,23,42,0.1)] backdrop-blur-xl'>
                <Link to='/' onClick={()=> scrollTo(0,0)}>
                    <img src={assets.logo} alt="logo" className="h-8" />
                </Link>

                <div className='hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex'>
                    {navLinks.map((link) => (
                        <Link onClick={()=> scrollTo(0,0)} to={link.href} key={link.name} className="transition hover:text-sky-700">
                            {link.name}
                        </Link>
                    ))}
                </div>
                {!user ?  (
                    <div className='hidden items-center gap-3 md:flex'>
                    <button onClick={()=>{setIsOpen(false); openSignIn()}} className='text-sm font-medium text-gray-600 transition hover:text-sky-700 max-sm:hidden'>
                        Sign in
                    </button>
                    <PrimaryButton onClick={() =>{setIsOpen(false); openSignUp()}} className='max-sm:text-xs hidden sm:inline-block'>Get Started</PrimaryButton>
                </div>
                ): (

                <div className='flex gap-2'>
                    <GhostButton onClick={()=> navigate('/plan')} className='border-gray-900/10 bg-slate-50 text-gray-700 sm:py-1.5'> Credits:{ credits} </GhostButton>
                    <UserButton><UserButton.MenuItems><UserButton.Action label='Generate 'labelIcon={<SparkleIcon size={14}/>}
                    onClick={()=>navigate('/generate')}/>
                    <UserButton.Action label='My Generations'labelIcon={<FolderEditIcon size={14}/>}
                    onClick={()=>navigate('/my-generation')}/>
                    <UserButton.Action label='Community'labelIcon={<GalleryHorizontalEnd size={14}/>}
                    onClick={()=>navigate('/Community')}/>
                    <UserButton.Action label='Plans'labelIcon={<DollarSign size={14}/>}
                    onClick={()=>navigate('/plan')}/>
                    </UserButton.MenuItems></UserButton>
                </div>
                )}
                {!user &&
                <button onClick={() => setIsOpen(!isOpen)} className='rounded-full border border-gray-900/12 bg-white p-2 text-gray-700 md:hidden'>
                    <MenuIcon className='size-5' />
                </button>}
                
                
            </div>
            <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white/95 text-lg font-medium text-gray-800 backdrop-blur-xl transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {navLinks.map((link) => (
                    <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className='transition hover:text-sky-700'>
                        {link.name}
                    </a>
                ))}

                <button onClick={() => setIsOpen(false)} className='font-medium text-gray-700 transition hover:text-sky-700'>
                    Sign in
                </button>
                <PrimaryButton onClick={() => setIsOpen(false)}>Get Started</PrimaryButton>

                <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border border-gray-900/15 bg-white p-2 text-gray-700 ring-sky-200 active:ring-2"
                >
                    <XIcon />
                </button>
            </div>
        </motion.nav>
    );
};

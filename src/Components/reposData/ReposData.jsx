import React,{useState,useEffect} from 'react';
import axios from 'axios';
import './ReposData.css';
import Pagination from '@material-ui/lab/Pagination';
import { useWindowScroll } from 'react-use';
import firebase, {auth} from "../../Firebase/config";
import {Link, useParams} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";


export default function ReposData(props){
  
  const [user] = useAuthState(auth);
  const [apiData,setApiData] = useState([]);
  const [page,setPage] = useState(1);
  const [totalItems,setTotalItems] = useState(0);
  const handleChange = (event,value)=>{
    setPage(value);
  };
  const topScroll = () => window.scrollTo({top:0,behavior:'smooth'})
  
  useEffect(async()=>{
     fetch(`https://api.github.com/users/${props.username}/repos`).then((res)=>{
       return res.json();
       
     }).then((total)=>{
       setTotalItems(total.length);
     })

  },[user])


    useEffect(async()=>{
      fetch(`https://api.github.com/users/${props.username}/repos?page=${page}&&per_page=5`).then((res)=>{
        console.log(res)
        return res.json();
      }).then((data)=>{
        console.log(data)
        setApiData(data);
        
      }).catch((error) =>{
        console.log(error)
        document.write(error.message)
      })
    },[page])

  return(
  <>
  <div className="repo_top_header">
  <h1>List of all repositories <span className="total_repo">{totalItems}</span> </h1>
  </div>
  {
       user && apiData.map((result)=>{
        
         return(
           <>
           <div key={result.id} className="repo_container">
            <Link to={`/repo/${result.owner.login}/${result.name}`} style={{ textDecoration: 'none' }} >
              <div className="repo_info">        
                <h3 className="repo_name">{result.name}</h3>
                <p className="repo_description">{result.description}</p>
                <p className="repo_date">{new Date(result.created_at).toLocaleString()}</p>
              </div> 
            </Link>
           </div>
           </>
         )
       })}
      <Pagination className="pagination"  count={Math.ceil(totalItems/5)}  page={page} color="primary" onClick={topScroll}  onChange={handleChange}/>
  
  </>
    
  )
}

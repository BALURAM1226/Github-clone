import React ,{useState} from 'react';
import {useParams} from "react-router-dom";
import {auth} from "../../Firebase/config"
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios"
import Navbar from '../homepage/Navbar';
import './DetailPage.css';
import LinkIcon from '@material-ui/icons/Link';

export default function DetailPage(props) {

  const [username,setUsername]=useState("")
  const [userpic,setUserpic] = useState("")
  const [description,setDescription] = useState("null")
  const [ repoUrl ,setRepoUrl] = useState("")
  const [repoFullName, setRepoFullName] = useState("")
  const [repoName,setRepoName] = useState("")
  const [date,setDate] = useState("")
  const {repoId,user} = useParams();

  React.useEffect(async () => {
    const result = await axios.get(`https://api.github.com/repos/${user}/${repoId}`);
    const {data} = result;
    setRepoFullName(data.full_name);
    setDescription(data.description);
    setUserpic(data.owner.avatar_url);
    setUsername(data.owner.login);
    setRepoUrl(data.html_url);
    setRepoName(data.name);
    setDate(data.created_at);
    
  }, [repoId])
  
  return(
    <>
   <Navbar 
     username={username}
     userpic={userpic}
    />
    
    <div className="repo_full_name">
      <h3>{repoFullName}</h3>
    </div>

    <h2 className = "repo_main_name">{repoName}</h2>
  
    <h5 className="repos_description">Description: {description}</h5>
     <div className="repos_link">
    <LinkIcon/> 
    <a href={repoUrl} target="_blank">{repoUrl}</a>
    </div>
    <h5 className="repos_date" >created_at:  {new Date(date).toLocaleString()}</h5>
    </>
  )
}
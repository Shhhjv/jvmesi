import React, { useState,useEffect } from 'react';
import { Table } from "react-bootstrap"
import firebase from "../src/utils/firebase" 
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';

function Logs(){
    const [loading, setLoading] = useState(true)
    const [logs, setLogs] = useState([])

    useEffect(()=>{
        fetchLogs()
    },[])

    const fetchLogs = async () => {

        const ref = await firebase.firestore().collection("logs").get()
    
        const dataRef = ref.docs.map(item => {
           const itemData = item.data() 
            return {
              ...itemData,
              id: item.id
            }
             
        })
    
        setLogs([...dataRef]) 
        setLoading(false)
    }


    return (
        <div>
            <Table striped bordered hover>
            <thead>
                <tr>
                  <th>Date</th> 
                  <th>Agent</th> 
                </tr>
            </thead>
            <tbody>
                {
                    logs
                    .sort((a,b) => {
                        const aDate = new Date(a?.date?.toDate?.()?.toString?.())
                        const bDate = new Date(b?.date?.toDate?.()?.toString?.())
          
                        return bDate - aDate
                      })
                    .map(item => {
                        return <tr key={item.id}>
                            <td>{ moment(item?.date?.toDate?.()?.toString?.()).format("MM/DD/YYYY hh:mm A") }</td>
                            <td>{item.userAgent}</td>
                        </tr>
                    })
                }
                {
                    loading?    
                        <tr>
                            <td colSpan={2}>Loading</td>
                        </tr>
                    : null
                }
            </tbody>
            </Table>    
        </div>
    )
}

export default Logs
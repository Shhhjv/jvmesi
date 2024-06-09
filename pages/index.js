import Head from 'next/head';
import styles from '../styles/Home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState,useEffect } from 'react';
import firebase from "../src/utils/firebase"
import { Button, Carousel,Modal,Form  } from "react-bootstrap"
import moment from 'moment';

export default function Home() {

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data,setData] = useState([ ]);
  const [selectedItem,setSelectedItem] = useState({});
  const [addModal,setAddModal] = useState(false);

  useEffect(()=>{
      const isAdmin= new URLSearchParams(window.location.search).get("isAdmin") 
      setIsAdmin(isAdmin)
      logOpened()
  },[ ])

  useEffect(()=>{
    fetchFeed()
  },[isAdmin])

  const fetchFeed = async () => {

    const ref = await firebase.firestore().collection("feed").get()

    const dataRef = ref.docs.map(item => {
       const itemData = item.data()

       if(isAdmin){
        return {
          ...itemData,
          id: item.id
        }
       }

       if(!itemData.isHidden){
          return {
            ...itemData,
            id: item.id
          }
       }

       return null
    })

    setData([...dataRef])
    setSelectedIndex(0)
    setLoading(false)
  }
  
  const handleSelect = (index) => {
    setSelectedIndex(index)
  }

  const hide = async (item,value) => {
    await firebase.firestore().collection("feed").doc(item.id).update({isHidden:value})
    fetchFeed()
  }

  const deleteItem = async (item) => {
    const confirm = window.confirm("Delete this record?")
    if(confirm){
      await firebase.firestore().collection("feed").doc(item.id).delete()
      fetchFeed()
    } 
  } 
  
  const edit = (item) => {
    setAddModal(true)
    setSelectedItem({...item})
  }

  const handleClose = () => {
    setAddModal(false)
  }

  const updateNow = async () => {
    if(!selectedItem.img){
      return alert("PLEASE INPUT IMAGE")
    }
    if(selectedItem.id){ 
      await firebase.firestore().collection("feed").doc(selectedItem.id).update({...selectedItem})
      fetchFeed()
      handleClose()
      return 
    }

    await firebase.firestore().collection("feed").add({...selectedItem, date: firebase.firestore.Timestamp.now() })
    fetchFeed()
    handleClose()
  }

  const handleChange = (key,value) => {
    setSelectedItem({
      ...selectedItem,
      [key]: value
    })
  }

  const addNew = () => {
    setSelectedItem({})
    setAddModal(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const baseUrl = Date.now().toString()
      const uploadTask = firebase
        .storage()
        .ref(`${baseUrl}/${file.name}`)
        .put(file);

        uploadTask.on(
          'state_changed',
          () => {},
          err => console.log(err),

          async () => { 

            const url = await firebase.storage().ref(baseUrl).child(file.name).getDownloadURL();

            setSelectedItem({
              ...selectedItem,
              img: url
            })
          },
        );
    }
  }

  const logOpened = () => {
    firebase.firestore().collection("logs").add({
      date: firebase.firestore.Timestamp.now(),
      userAgent: window.navigator.userAgent
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>JV Mesi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

      {loading?"Loading...":""}

      <Carousel  activeIndex={selectedIndex} onSelect={handleSelect}> 
          {
            data
            .filter(a => a)
            .sort((a,b) => {
              const aDate = new Date(a?.date?.toDate?.()?.toString?.())
              const bDate = new Date(b?.date?.toDate?.()?.toString?.())

              return bDate - aDate
            })
            .map(item => (
              <Carousel.Item key={item.image}> 
                {  
                    isAdmin ?
                    <div className='mb-2 text-center' style={{zIndex:999,position:"relative"}}>
                       <Button onClick={() => addNew()} className='mx-1 mt-1'> Add </Button>
                      <Button onClick={() => edit(item)} className='mr-2 mt-1'> Edit </Button>
                        {
                          item.isHidden?
                             <Button className='mx-1 mt-1' onClick={() => hide(item,false)}> Show </Button> : 
                          <Button className='mx-1 mt-1' variant="warning" onClick={() => hide(item,true)}> Hide </Button>
                        } 
                      <Button className='ml-1 mt-1' variant="danger" onClick={() => deleteItem(item)}> Delete </Button>
                    </div> : "" 
                    }
                <img src={item.img} style={{width:"100%"}}/>
                  <Carousel.Caption>  
                     <p style={{fontSize:"13px"}}>{item.message}</p>
                     <p style={{fontSize:"10px"}} >{moment(item?.date?.toDate?.()?.toString?.()).format("MM/DD/YYYY hh:mm A")}</p>
                  </Carousel.Caption>
                  
              </Carousel.Item>
            ))
          }
      </Carousel>

      <Modal show={addModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.id?"Edit":"Add"}</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
        <Form> 
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} value={selectedItem.message} onChange={e => handleChange("message",e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Image</Form.Label>
          <Form.Control  type='file'  accept="image/*" onChange={handleFileChange} />
        </Form.Group>
        {
          selectedItem?.img?
            <img src={selectedItem.img} style={{width:"100%"}}  />
          : null
        }
      </Form>
          
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateNow}>
            {selectedItem?.id?"Update":"Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
      </main>
    </div> 
  );
}

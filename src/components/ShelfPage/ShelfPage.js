import { useState, useEffect } from 'react';
import axios from 'axios';
import './ShelfPage.css';

function ShelfPage() {
  const [shelfList, setShelfList] = useState([]);
  const [shelfItemDescription, setShelfItemDescription] = useState('');
  const [shelfItemImageUrl, setShelfItemImageUrl] = useState('');

  useEffect(() => {
    fetchShelf();
  }, []);

  const fetchShelf = () => {
    axios.get('/api/shelf').then((response) => {
      console.log(response.data)
      setShelfList(response.data);
    }).catch((error) => {
      console.log(error);
      alert('Something went wrong.');
    });
  }


  const addItem = (e) => {
    e.preventDefault();
    axios.post('/api/shelf', {
      description: shelfItemDescription,
      imageUrl: shelfItemImageUrl,
    })
      .then(response => fetchShelf())
      .catch(error => {
        console.error(error);
        alert('Something went wrong.');
      });
  }

  const deleteItem = (itemId) => {
    axios.delete(`/api/shelf/${itemId}`)
      .then(response => fetchShelf())
      .catch(error => {
        console.error(error);
        alert('Something went wrong.');
      });
  }


  return (
    <div className="container">
      <h2>Shelf</h2>
      <form onSubmit={addItem}>
        Description: <input type="text" value={shelfItemDescription} onChange={e => setShelfItemDescription(e.target.value)}
        />
        <br />
        Image URL:
        <input type="text" value={shelfItemImageUrl} onChange={e => setShelfItemImageUrl(e.target.value)}
        />
        <br />
        <button>Submit</button>
      </form>
      <p>All of the available items can be seen here.</p>
      {
        shelfList.length === 0 && (
          <div>No items on the shelf</div>
        )
      }
      {
        shelfList.map(item => {
          return <div className="responsive" key={item.id}>
            <div className="gallery">


              <img src={item.image_url} alt={item.description} />
              <br />
              <div className="desc">{item.description}</div>
              <div style={{ textAlign: 'center', padding: '5px' }}>
                <button onClick={()=> deleteItem(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        })
      }
      <div className="clearfix"></div>
    </div>
  );
}

export default ShelfPage;

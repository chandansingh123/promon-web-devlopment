
# Habitat REM React Application


## Installation Instructions for Developers

1. After cloning the repo, checkout the develop branch. All active work is being done in the develop branch.
2. Run ```yarn``` command to install dependencies. Then run ```yarn start``` command to start the React development server. Open [http://localhost:3000/auth/login](http://localhost:3000/auth/login). You should see the Habitat REM application login page.
3. Next we need to map a fake DNS name to our local development machine. Add the line ```127.0.0.3       promon.local``` to the file ```/etc/hosts```. Ensure that the DNS name works by pinging to the server ```promon.local```. You will get a ping reply from the local server if the mapping works.
   ```
   $ ping promon.local
   PING promon.local (127.0.0.3) 56(84) bytes of data.
   64 bytes from promon.local (127.0.0.3): icmp_seq=1 ttl=64 time=0.061 ms
   64 bytes from promon.local (127.0.0.3): icmp_seq=2 ttl=64 time=0.066 ms
   64 bytes from promon.local (127.0.0.3): icmp_seq=3 ttl=64 time=0.058 ms
   ```
4. Add a virtual host to the nginx web server. We use nginx as a reverse proxy. Create a file ```/etc/nginx/sites-enabled/promon.local``` with the following contents. Then restart the nginx server using the command ```$ service nginx restart```.
   ```
   server {
	    server_name promon.local;

	    location / {
		     proxy_pass http://localhost:3000;
	    }

	    location /promon {
		     proxy_pass http://remdemo.sorus.co/promon;
	    }
   }
   ```
5. Open page [http://promon.local](http://promon.local) on your browser. You will be redirected to the login page. Enter the credentials (sudhirshakya@yahoo.com/sorus123).

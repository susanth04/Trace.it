# 🔐 Security Alert Resolution Guide

## ⚠️ Exposed Secret Detected

GitHub has detected an exposed Google API Key in your repository. This guide will help you secure your application.

## ✅ Steps Already Completed

1. ✅ Removed hardcoded secrets from `src/firebase.js`
2. ✅ Created `.env` file with secrets (gitignored)
3. ✅ Created `.env.example` template for other developers

## 🚨 CRITICAL: Rotate Your Firebase API Key

**You MUST rotate the exposed API key immediately:**

### Step 1: Restrict Current API Key (Immediate)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find the key: `AIzaSyA1U7TyZqehyKM4gvTjdalXTtqXbwPeNLk`
4. Click **Edit** → **Application restrictions**
5. Select **HTTP referrers** and add only:
   - `localhost:*` (for development)
   - `https://trace-kier60oux-susanth04s-projects.vercel.app/*` (your Vercel domain)
   - `https://*.vercel.app/*` (Vercel preview deployments)
6. Under **API restrictions**, select **Restrict key** and enable only:
   - Firebase Authentication API
   - Cloud Firestore API
   - Firebase Storage API

### Step 2: Generate New API Key (Recommended)
1. In Google Cloud Console → **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Immediately click **RESTRICT KEY**
4. Add the same restrictions as above
5. Copy the new API key

### Step 3: Update Your Environment Variables

**Local Development:**
1. Update `.env` file with the new API key:
   ```
   VITE_FIREBASE_API_KEY=your_new_api_key_here
   ```

**Vercel Production:**
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `trace.it`
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables:
   ```
   VITE_FIREBASE_API_KEY=your_new_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=web3-a4fc5.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=web3-a4fc5
   VITE_FIREBASE_STORAGE_BUCKET=web3-a4fc5.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=729670213536
   VITE_FIREBASE_APP_ID=1:729670213536:web:0f229afce330ad06554ec5
   VITE_FIREBASE_MEASUREMENT_ID=G-EVNNYQK0MV
   VITE_CONTRACT_ADDRESS=0x48F2825CB290F54DAD34f7c26869518c8C3B875C
   VITE_NETWORK=sepolia
   VITE_INFURA_KEY=9aa3d95b3bc440fa88ea12eaa4456161
   ```
5. Click **Save**
6. Redeploy: `vercel --prod`

### Step 4: Revoke Old Compromised Key
1. After confirming the new key works in production
2. Go back to Google Cloud Console → Credentials
3. Delete the old exposed API key: `AIzaSyA1U7TyZqehyKM4gvTjdalXTtqXbwPeNLk`

### Step 5: Clean Git History (Optional but Recommended)

The exposed key is still in your git history. To remove it:

```bash
# Install BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Create a text file with the exposed key
echo "AIzaSyA1U7TyZqehyKM4gvTjdalXTtqXbwPeNLk" > secrets.txt

# Run BFG to remove it from history
bfg --replace-text secrets.txt

# Force push (WARNING: This rewrites history)
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**⚠️ Warning:** Force pushing rewrites history. Coordinate with your team if others have cloned the repo.

## 📋 Security Best Practices Going Forward

1. ✅ **Never commit** `.env` files
2. ✅ **Always use** environment variables for secrets
3. ✅ **Enable API key restrictions** in Google Cloud Console
4. ✅ **Use Firebase App Check** for additional security
5. ✅ **Monitor usage** in Firebase Console for suspicious activity
6. ✅ **Enable alerts** for quota usage in Google Cloud

## 🔍 Verify Security

After completing the steps above:

1. Check that `.env` is in `.gitignore` ✅
2. Verify no secrets in `src/firebase.js` ✅
3. Test local development with new key
4. Test production deployment on Vercel
5. Verify old key is deleted from Google Cloud Console
6. Monitor Firebase Console for any unauthorized access

## 📞 Need Help?

- [Firebase Security Documentation](https://firebase.google.com/docs/projects/api-keys)
- [Google Cloud API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Status:** 🔴 **ACTION REQUIRED** - Please rotate the exposed API key immediately.

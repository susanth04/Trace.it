import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(walletAddress) {
  try {
    const userDocRef = doc(db, 'users', walletAddress.toLowerCase());
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Create or update user profile
 */
export async function createOrUpdateUserProfile(walletAddress, userData) {
  try {
    const userDocRef = doc(db, 'users', walletAddress.toLowerCase());
    await setDoc(userDocRef, {
      walletAddress: walletAddress.toLowerCase(),
      ...userData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    return false;
  }
}

/**
 * Store project metadata in Firestore (supplements blockchain data)
 */
export async function storeProjectMetadata(projectId, metadata) {
  try {
    const projectDocRef = doc(db, 'projects', projectId.toString());
    await setDoc(projectDocRef, {
      projectId,
      ...metadata,
      createdAt: new Date().toISOString(),
    });
    
    return true;
  } catch (error) {
    console.error('Error storing project metadata:', error);
    return false;
  }
}

/**
 * Get project metadata from Firestore
 */
export async function getProjectMetadata(projectId) {
  try {
    const projectDocRef = doc(db, 'projects', projectId.toString());
    const projectDoc = await getDoc(projectDocRef);
    
    if (projectDoc.exists()) {
      return projectDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting project metadata:', error);
    return null;
  }
}

/**
 * Store spending transaction details (with unencrypted descriptions)
 */
export async function storeSpendingDetails(projectId, spendingData) {
  try {
    const spendingDocRef = doc(collection(db, 'spending'));
    await setDoc(spendingDocRef, {
      projectId,
      ...spendingData,
      timestamp: new Date().toISOString(),
    });
    
    return spendingDocRef.id;
  } catch (error) {
    console.error('Error storing spending details:', error);
    return null;
  }
}

/**
 * Get all spending records for a project
 */
export async function getProjectSpendingRecords(projectId) {
  try {
    const spendingRef = collection(db, 'spending');
    const q = query(spendingRef, where('projectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    
    const records = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });
    
    return records;
  } catch (error) {
    console.error('Error getting spending records:', error);
    return [];
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(walletAddress, newRole) {
  try {
    const userDocRef = doc(db, 'users', walletAddress.toLowerCase());
    await updateDoc(userDocRef, {
      role: newRole,
      roleUpdatedAt: new Date().toISOString(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}

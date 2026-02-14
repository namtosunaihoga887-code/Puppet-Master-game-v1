using UnityEngine;

public class PuppetMaster : MonoBehaviour
{
    // Reference to the puppet object
    public GameObject puppet;
    
    // Physics properties
    public float forceMultiplier = 10f;
    public float jointElasticity = 0.5f;
    public float gravityScale = 1.5f;
    
    // Tool properties
    private bool isDragging = false;
    private Rigidbody selectedRigidbody;
    private Vector3 offset;
    
    void Start()
    {
        SetupPuppet();
    }
    
    void Update()
    {
        HandleInput();
    }
    
    /// <summary>
    /// Initialize the puppet with physics properties
    /// </summary>
    private void SetupPuppet()
    {
        if(puppet != null)
        {
            // Apply gravity scale to all rigidbodies in puppet
            Rigidbody[] rigidbodies = puppet.GetComponentsInChildren<Rigidbody>();
            foreach(Rigidbody rb in rigidbodies)
            {
                rb.mass *= gravityScale;
            }
            
            // Configure joint elasticity
            ConfigurableJoint[] joints = puppet.GetComponentsInChildren<ConfigurableJoint>();
            foreach(ConfigurableJoint joint in joints)
            {
                JointSpring spring = joint.angularXDrive;
                spring.spring = jointElasticity * 100f;
                spring.damper = jointElasticity * 10f;
                joint.angularXDrive = spring;
                
                joint.angularYZDrive = spring;
                joint.slerpDrive = spring;
            }
        }
    }
    
    /// <summary>
    /// Handle player input for manipulating the puppet
    /// </summary>
    private void HandleInput()
    {
        // Mouse/touch input handling
        if (Input.GetMouseButtonDown(0))
        {
            StartDrag();
        }
        else if (Input.GetMouseButton(0))
        {
            ContinueDrag();
        }
        else if (Input.GetMouseButtonUp(0))
        {
            EndDrag();
        }
        
        // Apply force with right click
        if (Input.GetMouseButtonDown(1))
        {
            ApplyForceAtPosition();
        }
    }
    
    /// <summary>
    /// Start dragging a rigidbody part of the puppet
    /// </summary>
    private void StartDrag()
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        
        if (Physics.Raycast(ray, out hit))
        {
            // Check if we clicked on a puppet part
            if (hit.collider.gameObject.transform.IsChildOf(puppet.transform))
            {
                selectedRigidbody = hit.collider.attachedRigidbody;
                if (selectedRigidbody != null)
                {
                    isDragging = true;
                    offset = selectedRigidbody.position - hit.point;
                }
            }
        }
    }
    
    /// <summary>
    /// Continue dragging the selected rigidbody
    /// </summary>
    private void ContinueDrag()
    {
        if (!isDragging || selectedRigidbody == null) return;
        
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        Vector3 targetPosition = ray.origin + ray.direction * (offset.magnitude + 1);
        
        // Move the rigidbody towards the mouse position
        selectedRigidbody.MovePosition(targetPosition + offset);
    }
    
    /// <summary>
    /// Release the dragged rigidbody
    /// </summary>
    private void EndDrag()
    {
        isDragging = false;
        selectedRigidbody = null;
    }
    
    /// <summary>
    /// Apply a force at the clicked position
    /// </summary>
    private void ApplyForceAtPosition()
    {
        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hit;
        
        if (Physics.Raycast(ray, out hit))
        {
            // Apply force to puppet parts at hit position
            Collider[] hitColliders = Physics.OverlapSphere(hit.point, 0.5f);
            foreach(Collider collider in hitColliders)
            {
                if (collider.attachedRigidbody != null && 
                    collider.gameObject.transform.IsChildOf(puppet.transform))
                {
                    Vector3 forceDirection = (hit.point - ray.origin).normalized;
                    collider.attachedRigidbody.AddForceAtPosition(
                        forceDirection * forceMultiplier, 
                        hit.point, 
                        ForceMode.Impulse);
                }
            }
        }
    }
    
    /// <summary>
    /// Apply force to the puppet using a specific tool
    /// </summary>
    public void ApplyToolForce(Vector3 force, Vector3 position, ForceMode mode = ForceMode.Impulse)
    {
        if(puppet != null)
        {
            Rigidbody[] rigidbodies = puppet.GetComponentsInChildren<Rigidbody>();
            foreach(Rigidbody rb in rigidbodies)
            {
                rb.AddForceAtPosition(force, position, mode);
            }
        }
    }
    
    /// <summary>
    /// Reset the puppet to initial state
    /// </summary>
    public void ResetPuppet()
    {
        if(puppet != null)
        {
            // Reset all rigidbodies to initial positions and clear velocities
            Rigidbody[] rigidbodies = puppet.GetComponentsInChildren<Rigidbody>();
            foreach(Rigidbody rb in rigidbodies)
            {
                rb.velocity = Vector3.zero;
                rb.angularVelocity = Vector3.zero;
            }
            
            // Re-enable gravity if it was disabled
            foreach(Rigidbody rb in rigidbodies)
            {
                rb.useGravity = true;
            }
        }
    }
}
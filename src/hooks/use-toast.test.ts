import { describe, it, expect } from "vitest";
import { reducer } from "./use-toast";

describe("toast reducer", () => {
  it("should handle ADD_TOAST", () => {
    const initialState = { toasts: [] };
    const newToast = { id: "1", title: "Test Toast" };
    const action = { type: "ADD_TOAST", toast: newToast } as any;

    const state = reducer(initialState, action);
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0]).toEqual(newToast);
  });

  it("should respect TOAST_LIMIT when adding toasts", () => {
    // TOAST_LIMIT is 1, so adding a second toast should replace the first
    const initialState = { toasts: [{ id: "1", title: "First Toast" }] };
    const newToast = { id: "2", title: "Second Toast" };
    const action = { type: "ADD_TOAST", toast: newToast } as any;

    const state = reducer(initialState as any, action);
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0]).toEqual(newToast);
  });

  it("should handle UPDATE_TOAST", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Test Toast", description: "Old description" },
        { id: "2", title: "Another Toast" }
      ]
    };
    const action = {
      type: "UPDATE_TOAST",
      toast: { id: "1", description: "New description" }
    } as any;

    const state = reducer(initialState as any, action);
    expect(state.toasts).toHaveLength(2);
    expect(state.toasts[0]).toEqual({ id: "1", title: "Test Toast", description: "New description" });
    expect(state.toasts[1]).toEqual({ id: "2", title: "Another Toast" });
  });

  it("should not update if toast id is not found", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Test Toast" }
      ]
    };
    const action = {
      type: "UPDATE_TOAST",
      toast: { id: "non-existent", title: "New title" }
    } as any;

    const state = reducer(initialState as any, action);
    expect(state.toasts).toEqual(initialState.toasts);
  });

  it("should handle DISMISS_TOAST with specific toastId", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Toast 1", open: true },
        { id: "2", title: "Toast 2", open: true }
      ]
    };
    const action = { type: "DISMISS_TOAST", toastId: "1" } as any;

    const state = reducer(initialState as any, action);
    expect(state.toasts[0].open).toBe(false);
    expect(state.toasts[1].open).toBe(true); // unaffected
  });

  it("should handle DISMISS_TOAST for all toasts when toastId is undefined", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Toast 1", open: true },
        { id: "2", title: "Toast 2", open: true }
      ]
    };
    const action = { type: "DISMISS_TOAST" } as any;

    const state = reducer(initialState as any, action);
    expect(state.toasts[0].open).toBe(false);
    expect(state.toasts[1].open).toBe(false);
  });

  it("should handle REMOVE_TOAST with specific toastId", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Toast 1" },
        { id: "2", title: "Toast 2" }
      ]
    };
    const action = { type: "REMOVE_TOAST", toastId: "1" } as any;

    const state = reducer(initialState as any, action);
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].id).toBe("2");
  });

  it("should handle REMOVE_TOAST for all toasts when toastId is undefined", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Toast 1" },
        { id: "2", title: "Toast 2" }
      ]
    };
    const action = { type: "REMOVE_TOAST" } as any;

    const state = reducer(initialState as any, action);
    expect(state.toasts).toHaveLength(0);
  });
});
